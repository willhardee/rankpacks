import { supabaseAdmin } from '@/lib/supabase';

export type AuthUser = {
  id: string;
  email: string | null;
};

export async function getUserFromRequest(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const supabase = supabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return { id: data.user.id, email: data.user.email ?? null };
}
