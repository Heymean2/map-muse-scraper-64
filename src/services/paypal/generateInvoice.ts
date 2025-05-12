
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Generates an invoice PDF for a specific transaction and stores it in Supabase
 */
export async function generateInvoice(transactionId: string): Promise<string | null> {
  try {
    // First, make sure we're authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (!session || !session.session) {
      toast.error("You must be logged in to generate invoices");
      return null;
    }
    
    // Call our invoice generator edge function with ID in the body
    const response = await supabase.functions.invoke('generateInvoice', {
      body: { id: transactionId }
    });
    
    if (response.error) {
      console.error("Invoice generation error:", response.error);
      toast.error("Failed to generate invoice");
      return null;
    }
    
    if (response.data?.url) {
      return response.data.url;
    } else {
      toast.error("No invoice URL returned");
      return null;
    }
    
  } catch (error) {
    console.error("Error generating invoice:", error);
    toast.error("Failed to generate invoice");
    return null;
  }
}
