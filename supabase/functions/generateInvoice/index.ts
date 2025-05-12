
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { TDocumentDefinitions } from "https://esm.sh/pdfmake@0.2.7";

// Set up storage bucket name constants
const INVOICE_BUCKET = "invoice_pdfs";

serve(async (req) => {
  console.log("generateInvoice function called");
  
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
    
    // Get the transaction details including plan information via join
    const { data: transaction, error: transactionError } = await supabase
      .from('billing_transactions')
      .select(`
        *,
        pricing_plans(name, price, billing_period, features)
      `)
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

    // Check if we already have an invoice PDF, return it if so
    if (transaction.invoice_file_path) {
      console.log("Using existing invoice file path:", transaction.invoice_file_path);
      // Generate a signed URL for the file
      const { data: signedUrl, error: signedUrlError } = await supabase
        .storage
        .from(INVOICE_BUCKET)
        .createSignedUrl(transaction.invoice_file_path, 60); // 60 second expiry
      
      if (signedUrlError) {
        console.error("Error creating signed URL:", signedUrlError);
        return new Response(JSON.stringify({ error: "Failed to generate invoice URL" }), {
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

    // Get user information for the invoice
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('email, display_name')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error("User profile fetch error:", userError);
      return new Response(JSON.stringify({ error: "Failed to fetch user profile" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Format the transaction date
    const transactionDate = new Date(transaction.transaction_date);
    const formattedDate = transactionDate.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });

    // Generate a unique invoice number
    const invoiceNumber = `INV-${transactionId.substring(0, 8).toUpperCase()}`;

    // Create a simple text-based invoice since PDF generation is challenging in Deno environment
    const invoiceText = `
INVOICE: ${invoiceNumber}
Date: ${formattedDate}

Billed To:
${userProfile.display_name || userProfile.email}
${userProfile.email}

Item: ${transaction.pricing_plans.name} ${transaction.credits_purchased ? 
      `(${transaction.credits_purchased} Credits)` : 
      `(${transaction.pricing_plans.billing_period} plan)`}
Amount: $${transaction.amount.toFixed(2)}

Payment Method: ${transaction.payment_method || 'PayPal'}
Transaction ID: ${transaction.payment_id || 'Not available'}
Status: ${transaction.status}

Thank you for your business!
`;

    // Convert text to Uint8Array
    const encoder = new TextEncoder();
    const invoiceBuffer = encoder.encode(invoiceText);

    // Ensure storage bucket exists (with improved error handling)
    try {
      // Check if the storage bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === INVOICE_BUCKET);
      
      if (!bucketExists) {
        console.log(`Creating storage bucket: ${INVOICE_BUCKET}`);
        const { error: bucketError } = await supabase.storage.createBucket(INVOICE_BUCKET, {
          public: false
        });
        
        if (bucketError) {
          // If error is not "bucket already exists", report it
          if (bucketError.statusCode !== "409") {
            console.error("Error creating storage bucket:", bucketError);
            console.log("Continuing anyway to try the upload...");
          } else {
            // If bucket already exists, just log and continue
            console.log("Bucket already exists, continuing with upload");
          }
        }
      } else {
        console.log(`Bucket ${INVOICE_BUCKET} already exists, continuing with upload`);
      }
    } catch (bucketError) {
      console.log("Error checking/creating bucket but continuing anyway:", bucketError);
    }
    
    // Store the invoice in Supabase Storage
    const fileName = `${user.id}/${transactionId}_invoice.txt`;
    console.log("Saving invoice to storage as:", fileName);
    
    try {
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(INVOICE_BUCKET)
        .upload(fileName, invoiceBuffer, {
          contentType: 'text/plain',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        return new Response(JSON.stringify({ error: "Failed to store invoice" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      console.log("Invoice file uploaded successfully");
      
      // Update the transaction with the invoice file path
      const { error: updateError } = await supabase
        .from('billing_transactions')
        .update({ invoice_file_path: fileName })
        .eq('id', transactionId);
        
      if (updateError) {
        console.error("Error updating transaction:", updateError);
      }
      
      // Generate a signed URL for the uploaded file
      const { data: signedUrl, error: signedUrlError } = await supabase
        .storage
        .from(INVOICE_BUCKET)
        .createSignedUrl(fileName, 60); // 60 second expiry
      
      if (signedUrlError) {
        console.error("Error creating signed URL:", signedUrlError);
        return new Response(JSON.stringify({ error: "Failed to generate invoice URL" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      console.log("Returning signed URL for generated invoice");
      return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("File upload error:", error);
      return new Response(JSON.stringify({ error: "Failed to store invoice", details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Invoice generation error:", error);
    
    return new Response(JSON.stringify({ error: error.message || "Failed to generate invoice" }), {
      status: error.status || 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
