// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://culwnizfggplctdtujsz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bHduaXpmZ2dwbGN0ZHR1anN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMzUwMjYsImV4cCI6MjA1NzYxMTAyNn0.-ajeJzWjufIy4RUkotdMgYWprFuQOJzA7a_aIYuCPA4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);