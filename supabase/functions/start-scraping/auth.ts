
import { Request } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Helper function to create a Supabase client with the user's JWT
export function getSupabaseClient(req: Request): SupabaseClient {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  const apikey = req.headers.get('apikey') || '';
  
  // Debug auth header and apikey presence
  console.log("Authorization header present:", !!authorization);
  console.log("API key present:", !!apikey);
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase URL or anon key in env variables");
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
        autoRefreshToken: false, // Edge functions run in a stateless environment
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
  
  console.log("Supabase client created successfully");
  return client;
}

// Authenticate user with JWT
export async function authenticateUser(req: Request): Promise<{ id: string, email?: string }> {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  
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
    // Verify JWT token directly
    // This simplifies the approach by focusing on basic JWT validation
    const supabase = getSupabaseClient(req);
    
    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error verifying JWT:", userError);
      throw {
        status: 401,
        message: "Invalid JWT token",
        details: userError.message
      };
    }
    
    if (!user) {
      console.error("No user found in token");
      throw {
        status: 401,
        message: "No user found in token"
      };
    }
    
    console.log("Authentication successful for user:", user.id);
    return { id: user.id, email: user.email };
  } catch (error) {
    console.error("Authentication error:", error);
    throw {
      status: 401,
      message: "Authentication failed. Please sign in again.",
      debug: error.toString()
    };
  }
}
