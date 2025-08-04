// lib/supabase.ts
// This file creates our connection to the Supabase database
// Think of this as the "phone line" to our cloud filing cabinet

import { createClient } from "@supabase/supabase-js";

// Get credentials from environment variables (secure way)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create the client - our database connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export types for TypeScript (we'll use these later)
export type Database = {
  public: {
    Tables: {
      // We'll define our database tables here later
    };
  };
};
