
import { supabase } from "@/integrations/supabase/client";
import { UserDetails } from "@/types/auth";

export async function fetchUserDetails(userId: string): Promise<UserDetails | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, provider, display_name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return {
      avatarUrl: data?.avatar_url || null,
      provider: data?.provider || 'email',
      displayName: data?.display_name || null,
    };
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return null;
  }
}
