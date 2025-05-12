
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";

// Function to get PayPal access token
async function getPayPalAccessToken() {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }
  
  const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    body: "grant_type=client_credentials"
  });
  
  const data = await response.json();
  if (!response.ok) {
    console.error("PayPal token error:", data);
    throw new Error("Failed to get PayPal access token");
  }
  
  return data.access_token;
}

// Function to sync transaction details with PayPal
async function syncTransactionWithPayPal(orderId, userId) {
  try {
    const accessToken = await getPayPalAccessToken();
    
    // Fetch order details from PayPal
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (!orderResponse.ok) {
      console.error("PayPal order fetch error:", await orderResponse.text());
      return false;
    }
    
    const orderData = await orderResponse.json();
    
    // Get capture ID from the order (if available)
    const purchaseUnit = orderData.purchase_units?.[0];
    const paymentCapture = purchaseUnit?.payments?.captures?.[0];
    
    if (!paymentCapture) {
      console.warn("No payment capture found in order", orderId);
      return false;
    }
    
    const captureId = paymentCapture.id;
    const status = orderData.status.toLowerCase();
    const amount = purchaseUnit.amount.value;
    const currency = purchaseUnit.amount.currency_code;
    const payerEmail = orderData.payer?.email_address;
    
    // Extract receipt URL
    const receiptLink = paymentCapture.links?.find(link => 
      link.rel === 'receipt' || link.rel === 'self'
    );
    const receiptUrl = receiptLink?.href || 
      `https://www.sandbox.paypal.com/activity/payment/${captureId}`;
    
    // Update transaction in our database
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials not configured");
      return false;
    }
    
    // Find transaction by order ID (payment_id)
    const findResponse = await fetch(`${supabaseUrl}/rest/v1/billing_transactions?payment_id=eq.${orderId}&user_id=eq.${userId}`, {
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json"
      }
    });
    
    const existingTransactions = await findResponse.json();
    
    if (existingTransactions && existingTransactions.length > 0) {
      // Update existing transaction
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/billing_transactions?id=eq.${existingTransactions[0].id}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: currency,
          status: status,
          receipt_url: receiptUrl,
          metadata: {
            ...existingTransactions[0].metadata,
            capture_id: captureId,
            payer_email: payerEmail,
            synced_at: new Date().toISOString()
          }
        })
      });
      
      if (!updateResponse.ok) {
        console.error("Failed to update transaction with PayPal details:", await updateResponse.text());
        return false;
      }
      
      console.log(`Successfully synced transaction ${orderId} with PayPal data`);
      return true;
    } else {
      console.warn(`Transaction not found for order ${orderId} and user ${userId}`);
      return false;
    }
  } catch (error) {
    console.error("Error syncing transaction with PayPal:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Authenticate request
    const user = await authenticate(req);
    
    // Parse request body
    const requestData = await req.json();
    const { orderID, plan, creditAmount, pricePerCredit } = requestData;
    
    if (!orderID || !plan) {
      return new Response(
        JSON.stringify({ error: "Order ID and Plan are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Capture PayPal payment
    const paypalResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    const paymentResult = await paypalResponse.json();
    
    if (!paypalResponse.ok) {
      console.error("PayPal capture error:", paymentResult);
      return new Response(
        JSON.stringify({ error: "Failed to capture PayPal payment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get plan details to determine what to update
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const planResponse = await fetch(`${supabaseUrl}/rest/v1/pricing_plans?id=eq.${plan}`, {
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json"
      }
    });
    
    const plans = await planResponse.json();
    
    if (!plans || plans.length === 0) {
      throw new Error("Plan not found");
    }
    
    // Store the order ID as payment_id in the transaction
    const transactionResponse = await fetch(`${supabaseUrl}/rest/v1/billing_transactions`, {
      method: "POST",
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        user_id: user.id,
        plan_id: plan,
        payment_id: orderID,
        payment_method: "paypal",
        status: "processing",
        amount: plans[0].billing_period === "credits" && creditAmount 
          ? (creditAmount * (pricePerCredit || plans[0].price_per_credit)).toFixed(2)
          : plans[0].price,
        credits_purchased: plans[0].billing_period === "credits" ? creditAmount : null,
        billing_period: plans[0].billing_period,
        metadata: {
          order_created: new Date().toISOString()
        }
      })
    });
    
    if (!transactionResponse.ok) {
      console.error("Failed to record transaction:", await transactionResponse.text());
    }
    
    // Different handling based on plan type
    if (plans[0].billing_period === "credits" && creditAmount) {
      // For credit purchases
      
      // Get user's current credits
      const userResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`, {
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json"
        }
      });
      
      const users = await userResponse.json();
      
      if (!users || users.length === 0) {
        throw new Error("User profile not found");
      }
      
      const currentCredits = users[0].credits || 0;
      const newCredits = currentCredits + creditAmount;
      
      // Use the appropriate price per credit
      let actualPricePerCredit;
      
      if (pricePerCredit && pricePerCredit > 0.001) {
        // Use the price provided in the request
        actualPricePerCredit = pricePerCredit;
        console.log(`Using provided price per credit: ${actualPricePerCredit}`);
      } else if (plans[0].price_per_credit && plans[0].price_per_credit > 0.001) {
        // Use DB price if it's valid
        actualPricePerCredit = plans[0].price_per_credit;
        console.log(`Using DB price per credit: ${actualPricePerCredit}`);
      } else {
        // Fallback to hardcoded value
        actualPricePerCredit = 0.002; // Changed from 0.00299 to 0.002 to match the current pricing
        console.log(`Using fallback price per credit: ${actualPricePerCredit}`);
      }
      
      // Update user's credits in profiles table - DO NOT create an additional transaction
      const profileUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          credits: newCredits
        })
      });
      
      if (!profileUpdateResponse.ok) {
        throw new Error("Failed to update user credits");
      }
      
    } else {
      // For subscription plans - handle in a separate subscription manager
      // For now, just record the transaction
      
      // Update user's plan in profiles
      const profileUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          plan_id: plan
        })
      });
      
      if (!profileUpdateResponse.ok) {
        throw new Error("Failed to update user subscription");
      }
    }
    
    // Sync transaction details with PayPal to ensure accuracy
    await syncTransactionWithPayPal(orderID, user.id);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Payment processed successfully"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in captureOrder:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while capturing the order" 
      }),
      { 
        status: error.status || 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
