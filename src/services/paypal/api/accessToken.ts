
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets an access token from PayPal API
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }
  
  try {
    // Use sandbox URL for development, replace with production URL for production
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: "grant_type=client_credentials"
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal token error:", errorData);
      throw new Error("Failed to get PayPal access token");
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error: any) {
    console.error("Error getting PayPal access token:", error);
    throw new Error(`PayPal authentication failed: ${error.message}`);
  }
}
