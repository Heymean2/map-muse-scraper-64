
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "./cors.ts";

// Authenticate user with JWT
export async function authenticate(req) {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  
  // Log the headers we're receiving (without exposing sensitive info)
  console.log("Auth request headers:", {
    authorization: authorization ? "Present (first 10 chars: " + authorization.substring(0, 10) + "...)" : "Missing",
    contentType: req.headers.get('Content-Type'),
    apikey: req.headers.has('apikey') ? "Present" : "Missing"
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
    // Create Supabase client with auth token
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
    
    // Create client with the JWT token in headers
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Try to get user from JWT token
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Error verifying JWT:", error.message);
      throw {
        status: 401,
        message: "Invalid authentication token"
      };
    }
    
    if (!data.user) {
      console.error("No user found in JWT");
      throw {
        status: 401,
        message: "No user associated with token"
      };
    }
    
    console.log("Authentication successful for user:", data.user.id);
    return { id: data.user.id, email: data.user.email };
    
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
