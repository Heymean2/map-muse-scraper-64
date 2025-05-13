
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

// Helper function to only log in development mode
const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

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
    
    // We don't need to toast here as the auth state listener will handle it
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Failed to sign out");
  }
}

export async function refreshSession(): Promise<Session | null> {
  try {
    // Only log this in development
    devLog("Manually refreshing session...");
    
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }
    
    // Only log in development
    devLog("Session refreshed successfully");
    return data.session;
  } catch (error) {
    console.error("Failed to refresh session:", error);
    throw error;
  }
}
