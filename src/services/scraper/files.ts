
/**
 * Download CSV file from result_url
 */
export async function downloadCsvFromUrl(url: string): Promise<string> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    
    // Check for user authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Authentication required. Please sign in to download results.");
    }
    
    // Get session token for authenticated request
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
      throw new Error("No valid session. Please sign in again.");
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw error;
  }
}
