
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
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

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Authenticate request
    const user = await authenticate(req);
    
    // Parse request body
    const { orderID, plan } = await req.json();
    if (!orderID) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Capture the PayPal order
    const captureResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );
    
    const captureData = await captureResponse.json();
    if (!captureResponse.ok) {
      console.error("PayPal capture error:", captureData);
      return new Response(
        JSON.stringify({ error: "Failed to capture PayPal order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Extract payment details
    const captureId = captureData.purchase_units[0]?.payments?.captures[0]?.id;
    const amount = captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value || "0.00";
    const currency = captureData.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code || "USD";
    const paymentStatus = captureData.status;
    
    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    );
    
    // Record payment in database
    const { error: paymentError } = await supabaseAdmin
      .from("billing_transactions")
      .insert({
        user_id: user.id,
        plan_id: plan,
        amount: parseFloat(amount),
        currency: currency,
        status: paymentStatus === "COMPLETED" ? "completed" : "pending",
        payment_method: "paypal",
        payment_id: captureId,
        metadata: captureData
      });
    
    if (paymentError) {
      console.error("Database payment recording error:", paymentError);
      return new Response(
        JSON.stringify({ error: "Payment was processed but failed to record in database" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update user's plan in profiles table
    if (plan) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ plan_id: plan })
        .eq("id", user.id);
      
      if (profileError) {
        console.error("User profile update error:", profileError);
        return new Response(
          JSON.stringify({ error: "Payment was processed but failed to update user plan" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        captureID: captureId,
        status: paymentStatus,
        details: captureData
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
