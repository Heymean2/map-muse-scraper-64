
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "./cors.ts";

// Authenticate user with JWT
export async function authenticate(req) {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  const apikey = req.headers.get('apikey') || '';
  
  console.log("Auth headers received:", { 
    authorization: authorization ? `${authorization.substring(0, 15)}...` : 'none', 
    apikey: apikey ? 'present' : 'none' 
  });
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.error("Missing or invalid Authorization header");
    throw {
      status: 401,
      message: "Missing or invalid Authorization header"
    };
  }
  
  const token = authorization.substring('Bearer '.length);
  if (!token) {
    console.error("Empty token provided");
    throw {
      status: 401,
      message: "Empty token provided"
    };
  }
  
  try {
    // Create Supabase client with auth headers
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase URL or anon key in env variables");
      throw {
        status: 500,
        message: "Server configuration error"
      };
    }
    
    console.log("Creating Supabase client with URL:", supabaseUrl);
    
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
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
    
    // Try to get user directly from JWT without making additional calls
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error verifying JWT:", userError.message);
      throw {
        status: 401,
        message: "Invalid authentication token"
      };
    }
    
    if (!user) {
      console.error("No user found in JWT");
      throw {
        status: 401,
        message: "No user associated with token"
      };
    }
    
    console.log("Authentication successful for user:", user.id);
    return { id: user.id, email: user.email };
    
  } catch (error) {
    console.error("Authentication error:", error);
    
    // If this is already our custom error, just rethrow it
    if (error.status && error.message) {
      throw error;
    }
    
    throw {
      status: 401,
      message: "Authentication failed. Please sign in again."
    };
  }
}
