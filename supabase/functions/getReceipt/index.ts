
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Serve the function with Deno
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const user = await authenticate(req);

    // Get the transaction ID from the URL
    const url = new URL(req.url);
    const transactionId = url.searchParams.get('id');
    
    if (!transactionId) {
      return new Response(JSON.stringify({ error: "Missing transaction ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the transaction details
    const { data: transaction, error: transactionError } = await supabase
      .from('billing_transactions')
      .select('payment_id, receipt_url, receipt_file_path')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .single();
    
    if (transactionError || !transaction) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // If we already have a local receipt file, redirect to it
    if (transaction.receipt_file_path) {
      // Generate a signed URL for the file
      const { data: signedUrl } = await supabase
        .storage
        .from('transaction_receipts')
        .createSignedUrl(transaction.receipt_file_path, 60); // 60 second expiry
      
      if (signedUrl) {
        return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    // If no local receipt exists yet, but we have a receipt URL, download from PayPal
    if (transaction.receipt_url) {
      // Get PayPal credentials
      const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      
      if (!paypalClientId || !paypalClientSecret) {
        return new Response(JSON.stringify({ error: "PayPal credentials not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      // Get OAuth2 token from PayPal
      const tokenResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`
        },
        body: "grant_type=client_credentials"
      });
      
      if (!tokenResponse.ok) {
        console.error("PayPal token error:", await tokenResponse.text());
        return new Response(JSON.stringify({ error: "Failed to authenticate with PayPal" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      // Fetch receipt from PayPal
      const receiptResponse = await fetch(transaction.receipt_url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      
      if (!receiptResponse.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch receipt from PayPal" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      // Get receipt content
      const receiptContent = await receiptResponse.blob();
      const contentType = receiptResponse.headers.get('Content-Type') || 'application/pdf';
      
      // Store the receipt in Supabase Storage
      const fileName = `${user.id}/${transactionId}_receipt.${contentType.includes('pdf') ? 'pdf' : 'txt'}`;
      
      // Convert blob to arrayBuffer for upload
      const arrayBuffer = await receiptContent.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('transaction_receipts')
        .upload(fileName, uint8Array, {
          contentType,
          upsert: true
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        return new Response(JSON.stringify({ error: "Failed to store receipt" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      // Update the transaction with the file path
      await supabase
        .from('billing_transactions')
        .update({ receipt_file_path: fileName })
        .eq('id', transactionId);
      
      // Generate a signed URL for the uploaded file
      const { data: signedUrl } = await supabase
        .storage
        .from('transaction_receipts')
        .createSignedUrl(fileName, 60); // 60 second expiry
      
      return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // No receipt available
    return new Response(JSON.stringify({ error: "No receipt available for this transaction" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Receipt download error:", error);
    
    return new Response(JSON.stringify({ error: error.message || "Failed to retrieve receipt" }), {
      status: error.status || 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
