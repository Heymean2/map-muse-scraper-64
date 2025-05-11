
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

export async function signOut(): Promise<void> {
  try {
    // First clear any cached auth data
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Then sign out
    await supabase.auth.signOut({ scope: 'global' });
    
    toast.info("Signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Failed to sign out");
  }
}

export async function refreshSession(): Promise<Session | null> {
  try {
    console.log("Manually refreshing session...");
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }
    
    console.log("Session refreshed successfully");
    return data.session;
  } catch (error) {
    console.error("Failed to refresh session:", error);
    throw error;
  }
}
