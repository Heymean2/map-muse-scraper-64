
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
    console.warn("Authorization header not in expected 'Bearer <token>' format:", authorization.substring(0, 20) + "...");
  }
  
  // Create Supabase client with auth headers
  const client = createClient(
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
  
  console.log("Supabase client created successfully");
  return client;
}

// Authenticate user and return user data or throw error
export async function authenticateUser(supabase: SupabaseClient) {
  try {
    console.log("Attempting to authenticate user...");
    
    try {
      // First try with getUser() which should work with the provided JWT
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!userError && user) {
        console.log("Authentication successful via getUser()");
        return user;
      }
      
      if (userError) {
        console.log("Auth error with getUser:", userError.message);
        // Continue to fallback methods
      }
    } catch (getUserError) {
      console.log("Exception in getUser:", getUserError);
      // Continue to fallback methods
    }
    
    try {
      // Fall back to getSession for compatibility
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (!sessionError && sessionData?.session?.user) {
        console.log("Authentication successful via getSession()");
        return sessionData.session.user;
      }
      
      if (sessionError) {
        console.error("Session error:", sessionError.message);
      } else if (!sessionData?.session) {
        console.error("No session found in getSession response");
      }
    } catch (sessionError) {
      console.error("Exception in getSession:", sessionError);
    }
    
    // If we get here, neither method worked
    throw {
      status: 401,
      message: "Authentication failed: No valid session found",
      details: "Both getUser and getSession methods failed"
    };
  } catch (error) {
    console.error("Error in authenticateUser:", error);
    throw {
      status: 401,
      message: "Authentication failed. Please sign in again.",
      debug: { error_details: String(error) }
    };
  }
}
