
import { Request } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Helper function to create a Supabase client with the user's JWT
export function getSupabaseClient(req: Request): SupabaseClient {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  const apikey = req.headers.get('apikey') || '';
  
  // Debug auth header and apikey presence
  console.log("Authorization header length:", authorization ? authorization.length : 0);
  console.log("API key present:", !!apikey);
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase URL or anon key in env variables");
  }
  
  // Extract JWT token from Authorization header
  let jwtToken = '';
  if (authorization && authorization.startsWith('Bearer ')) {
    jwtToken = authorization.substring('Bearer '.length);
    console.log("JWT token extracted successfully, length:", jwtToken.length);
  } else {
    console.warn("Authorization header not in expected 'Bearer <token>' format");
  }
  
  // Create Supabase client with auth headers
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: authorization,
          apikey,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}

// Authenticate user and return user data or throw error
export async function authenticateUser(supabase: SupabaseClient) {
  try {
    // First try with getUser() which should work with the provided JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Auth error with getUser:", userError.message);
      
      // Fall back to getSession for compatibility
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error("Session error:", sessionError?.message || "No session found");
        throw {
          status: 401,
          message: "Authentication failed: No valid session found",
          debug: { 
            userError: userError.message,
            sessionError: sessionError?.message || "No session data" 
          }
        };
      }
      
      // Use the user from session if available
      if (sessionData.session?.user) {
        console.log("Authentication successful via session fallback");
        return sessionData.session.user;
      }
      
      // If we still don't have a user, throw error
      throw {
        status: 401,
        message: "Authentication required. Please sign in to use this feature.",
        debug: { auth_header_present: !!supabase.auth }
      };
    }
    
    if (!user) {
      console.error("No user found in JWT");
      throw {
        status: 401,
        message: "Authentication required. Please sign in to use this feature.",
        debug: { auth_header_present: !!supabase.auth }
      };
    }
    
    console.log("User authenticated successfully:", user.id);
    return user;
  } catch (error) {
    console.error("Error in authenticateUser:", error);
    throw {
      status: 401,
      message: "Authentication failed. Please sign in again.",
      debug: { error_details: String(error) }
    };
  }
}
