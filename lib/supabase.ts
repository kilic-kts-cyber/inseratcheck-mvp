import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Zur Build-Zeit kann das passieren – kein throw, nur null zurückgeben
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Singleton, aber lazy – wird erst beim ersten echten Aufruf erstellt
let _supabase = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = getSupabaseClient();
  }
  return _supabase;
}

// Named export für direkten Zugriff – aber NUR clientseitig verwenden
export const supabase = typeof window !== "undefined" ? getSupabaseClient() : null;
