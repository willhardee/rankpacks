import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabaseBrowser = () => createClient<Database>(url, anonKey);
export const supabaseAdmin = () => createClient<Database>(url, serviceRole, { auth: { persistSession: false } });
