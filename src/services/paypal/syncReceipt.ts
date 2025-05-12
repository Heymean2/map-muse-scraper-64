
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Downloads a receipt for a specific transaction and stores it in Supabase
 */
export async function syncReceipt(transactionId: string): Promise<string | null> {
  try {
    // First, make sure we're authenticated
    const { data: session } = await supabase.auth.getSession();
    
    if (!session || !session.session) {
      toast.error("You must be logged in to download receipts");
      return null;
    }
    
    // Call our receipt edge function with ID in the body
    const response = await supabase.functions.invoke('getReceipt', {
      body: { id: transactionId }
    });
    
    if (response.error) {
      console.error("Receipt download error:", response.error);
      toast.error("Failed to download receipt");
      return null;
    }
    
    if (response.data?.url) {
      return response.data.url;
    } else {
      toast.error("No receipt URL returned");
      return null;
    }
    
  } catch (error) {
    console.error("Error syncing receipt:", error);
    toast.error("Failed to download receipt");
    return null;
  }
}
