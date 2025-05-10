
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "./cors.ts";

// Authenticate user with JWT
export async function authenticate(req) {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw {
      status: 401,
      message: "Missing or invalid Authorization header"
    };
  }
  
  const token = authorization.substring('Bearer '.length);
  if (!token) {
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
      throw {
        status: 500,
        message: "Server configuration error"
      };
    }
    
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
      throw {
        status: 401,
        message: "Invalid authentication token"
      };
    }
    
    if (!data.user) {
      throw {
        status: 401,
        message: "No user associated with token"
      };
    }
    
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
