
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Set up storage bucket name constants
const STORAGE_BUCKET = "transaction_receipts";

// Serve the function with Deno
Deno.serve(async (req) => {
  console.log("getReceipt function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const user = await authenticate(req);
    console.log("User authenticated:", user.id);

    // Get the transaction ID from the request body
    const { id: transactionId } = await req.json();
    
    console.log("Transaction ID from body:", transactionId);
    
    if (!transactionId) {
      console.error("Missing transaction ID");
      return new Response(JSON.stringify({ error: "Missing transaction ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Fetching transaction details for ID:", transactionId);
    
    // Get the transaction details
    const { data: transaction, error: transactionError } = await supabase
      .from('billing_transactions')
      .select('payment_id, receipt_url, receipt_file_path')
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .single();
    
    if (transactionError) {
      console.error("Transaction fetch error:", transactionError);
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    if (!transaction) {
      console.error("No transaction found with ID:", transactionId);
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("Transaction found:", transaction);

    // If we already have a local receipt file, redirect to it
    if (transaction.receipt_file_path) {
      console.log("Using existing receipt file path:", transaction.receipt_file_path);
      // Generate a signed URL for the file
      const { data: signedUrl, error: signedUrlError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(transaction.receipt_file_path, 60); // 60 second expiry
      
      if (signedUrlError) {
        console.error("Error creating signed URL:", signedUrlError);
        return new Response(JSON.stringify({ error: "Failed to generate receipt URL" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      if (signedUrl) {
        console.log("Returning signed URL");
        return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    // If no local receipt exists yet, but we have a receipt URL, download from PayPal
    if (transaction.receipt_url) {
      console.log("Downloading from PayPal URL:", transaction.receipt_url);
      
      // Get PayPal credentials
      const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
      
      if (!paypalClientId || !paypalClientSecret) {
        console.error("PayPal credentials missing");
        return new Response(JSON.stringify({ error: "PayPal credentials not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      // Get OAuth2 token from PayPal
      console.log("Getting PayPal OAuth token");
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
      console.log("PayPal token obtained");
      
      // Fetch receipt from PayPal
      console.log("Fetching receipt from PayPal");
      const receiptResponse = await fetch(transaction.receipt_url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      
      if (!receiptResponse.ok) {
        console.error("PayPal receipt fetch error:", await receiptResponse.text());
        return new Response(JSON.stringify({ error: "Failed to fetch receipt from PayPal" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      // Get receipt content
      let receiptContent;
      const contentType = receiptResponse.headers.get('Content-Type') || 'application/pdf';
      console.log("Receipt content type:", contentType);
      
      // For JSON content, convert it to a formatted text file
      let fileExtension;
      if (contentType.includes('json')) {
        // Get the JSON data
        const jsonData = await receiptResponse.json();
        // Convert to pretty-printed text for storage
        receiptContent = new TextEncoder().encode(JSON.stringify(jsonData, null, 2));
        fileExtension = 'txt'; // Store as text file instead of json
      } else {
        // For non-JSON content, get as blob
        receiptContent = new Uint8Array(await receiptResponse.arrayBuffer());
        fileExtension = contentType.includes('pdf') ? 'pdf' : 'txt';
      }
      
      // Ensure storage bucket exists (improved error handling for existing bucket)
      try {
        // Check if the storage bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
        
        if (!bucketExists) {
          console.log(`Creating storage bucket: ${STORAGE_BUCKET}`);
          const { error: bucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
            public: false
          });
          
          if (bucketError) {
            // If error is not "bucket already exists", report it
            if (bucketError.statusCode !== "409") {
              console.error("Error creating storage bucket:", bucketError);
              return new Response(JSON.stringify({ error: "Failed to create storage bucket" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
              });
            } else {
              // If bucket already exists, just log and continue
              console.log("Bucket already exists, continuing with upload");
            }
          }
        } else {
          console.log(`Bucket ${STORAGE_BUCKET} already exists, continuing with upload`);
        }
      } catch (bucketError) {
        console.log("Error checking/creating bucket but continuing anyway:", bucketError);
        // We'll continue and try to upload anyway
      }
      
      // Store the receipt in Supabase Storage
      const fileName = `${user.id}/${transactionId}_receipt.${fileExtension}`;
      console.log("Saving to storage as:", fileName);
      
      try {
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from(STORAGE_BUCKET)
          .upload(fileName, receiptContent, {
            contentType: 'text/plain', // Always use text/plain content type
            upsert: true
          });
        
        if (uploadError) {
          console.error("Upload error:", uploadError);
          return new Response(JSON.stringify({ error: "Failed to store receipt" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        console.log("File uploaded successfully");
        
        // Update the transaction with the file path
        const { error: updateError } = await supabase
          .from('billing_transactions')
          .update({ receipt_file_path: fileName })
          .eq('id', transactionId);
          
        if (updateError) {
          console.error("Error updating transaction:", updateError);
        }
        
        // Generate a signed URL for the uploaded file
        const { data: signedUrl, error: signedUrlError } = await supabase
          .storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(fileName, 60); // 60 second expiry
        
        if (signedUrlError) {
          console.error("Error creating signed URL:", signedUrlError);
          return new Response(JSON.stringify({ error: "Failed to generate receipt URL" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        console.log("Returning signed URL for downloaded receipt");
        return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("File upload error:", error);
        return new Response(JSON.stringify({ error: "Failed to store receipt", details: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    // No receipt available
    console.error("No receipt URL available for transaction");
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
