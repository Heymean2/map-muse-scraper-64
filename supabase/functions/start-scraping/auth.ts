
import { Request } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Helper function to create a Supabase client with the user's JWT
export function getSupabaseClient(req: Request): SupabaseClient {
  // Get Auth token from request
  const authorization = req.headers.get('Authorization') || '';
  const apikey = req.headers.get('apikey') || '';

  console.log("Authorization header present:", !!authorization);
  if (authorization) {
    console.log("Auth header starts with:", authorization.substring(0, 15) + "...");
  } else {
    console.log("WARNING: No authorization header found!");
  }
  
  // Debug all headers for troubleshooting
  console.log("--- REQUEST HEADERS DETAILED DEBUG ---");
  for (const [key, value] of req.headers.entries()) {
    if (key.toLowerCase() === 'authorization') {
      console.log(`${key} header exists with length: ${value.length}`);
    } else if (key.toLowerCase() === 'apikey') {
      console.log(`${key} header exists: true`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  console.log("--------------------------------------");
  
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
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
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Auth error:", userError.message);
    throw {
      status: 401,
      message: "Authentication error: " + userError.message,
      debug: { has_auth_header: true }
    };
  }
  
  if (!user) {
    console.error("No user found in JWT");
    throw {
      status: 401,
      message: "Unauthorized. Please sign in to use this feature.",
      debug: { has_auth_header: true }
    };
  }
  
  console.log("User authenticated:", user.id);
  return user;
}
