
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

// Function to determine price based on plan
async function getPlanPrice(planId, creditAmount = null) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials not configured");
  }
  
  const response = await fetch(`${supabaseUrl}/rest/v1/pricing_plans?id=eq.${planId}`, {
    headers: {
      "apikey": supabaseServiceKey,
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json"
    }
  });
  
  const plans = await response.json();
  if (!plans || plans.length === 0) {
    throw new Error(`Plan not found: ${planId}`);
  }
  
  // If it's a credit purchase with custom amount
  if (creditAmount && plans[0].billing_period === 'credits') {
    return {
      value: (plans[0].price_per_credit * creditAmount).toString(),
      name: `${creditAmount.toLocaleString()} Credits`
    };
  }
  
  // Regular plan purchase
  return {
    value: plans[0].price.toString(),
    name: plans[0].name
  };
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
    const { plan, creditAmount } = requestData;
    
    if (!plan) {
      return new Response(
        JSON.stringify({ error: "Plan is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get plan price, considering custom credit amount if provided
    const planDetails = await getPlanPrice(plan, creditAmount);
    console.log(`Order for plan ${plan}, amount: ${planDetails.value}, name: ${planDetails.name}`);
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Create PayPal order
    const paypalResponse = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: planDetails.value
            },
            description: creditAmount 
              ? `Purchase of ${planDetails.name}`
              : `Subscription to ${planDetails.name} Plan`
          }
        ]
      })
    });
    
    const paypalOrder = await paypalResponse.json();
    if (!paypalResponse.ok) {
      console.error("PayPal order creation error:", paypalOrder);
      return new Response(
        JSON.stringify({ error: "Failed to create PayPal order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        orderID: paypalOrder.id,
        plan: plan,
        creditAmount: creditAmount || null
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in createOrder:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while creating the order" 
      }),
      { 
        status: error.status || 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
