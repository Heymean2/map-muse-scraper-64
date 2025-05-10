
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

// Function to update user credits
async function updateUserCredits(userId, credits, pricePerCredit, planId) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials not configured");
  }
  
  console.log(`Updating user ${userId} with ${credits} credits`);
  
  // Update user's credits in profiles table
  const profileUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      "apikey": supabaseServiceKey,
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      credits: credits
    })
  });
  
  if (!profileUpdateResponse.ok) {
    throw new Error("Failed to update user credits");
  }
  
  // Record the transaction in billing_transactions table
  const transactionResponse = await fetch(`${supabaseUrl}/rest/v1/billing_transactions`, {
    method: "POST",
    headers: {
      "apikey": supabaseServiceKey,
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      user_id: userId,
      plan_id: planId,
      amount: (credits * pricePerCredit).toFixed(2),
      credits_purchased: credits,
      status: "completed",
      payment_method: "paypal",
      metadata: {
        price_per_credit: pricePerCredit
      }
    })
  });
  
  if (!transactionResponse.ok) {
    console.error("Failed to record transaction:", await transactionResponse.text());
    // Don't throw error here, as credits have been updated
  }
  
  return true;
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
        // Fallback to hardcoded value - no more precision issues!
        actualPricePerCredit = 0.00299;
        console.log(`Using fallback price per credit: ${actualPricePerCredit}`);
      }
      
      // Update user's credits
      await updateUserCredits(user.id, newCredits, actualPricePerCredit, plan);
      
    } else {
      // For subscription plans - handle in a separate subscription manager
      // For now, just record the transaction
      
      const transactionResponse = await fetch(`${supabaseUrl}/rest/v1/billing_transactions`, {
        method: "POST",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          user_id: user.id,
          plan_id: plan,
          amount: plans[0].price,
          status: "completed",
          payment_method: "paypal",
          billing_period: plans[0].billing_period
        })
      });
      
      if (!transactionResponse.ok) {
        console.error("Failed to record subscription transaction:", await transactionResponse.text());
      }
      
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
