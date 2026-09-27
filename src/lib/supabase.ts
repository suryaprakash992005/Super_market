import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Safe Supabase query runner that falls back gracefully if Supabase is not connected
 */
export async function safeSupabaseQuery<T>(
  queryFn: (client: NonNullable<typeof supabase>) => Promise<{ data: T | null; error: any }>,
  fallbackData: T
): Promise<{ data: T; isLive: boolean; error: any }> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: fallbackData, isLive: false, error: null };
  }

  try {
    const { data, error } = await queryFn(supabase);
    if (error || data === null) {
      console.warn('Supabase query error, falling back to local store:', error);
      return { data: fallbackData, isLive: false, error };
    }
    return { data, isLive: true, error: null };
  } catch (err) {
    console.warn('Supabase network error, falling back to local store:', err);
    return { data: fallbackData, isLive: false, error: err };
  }
}
