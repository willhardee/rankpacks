import { bordaCount } from '@/lib/ranking';
import { supabaseAdmin } from '@/lib/supabase';

export type PackCard = {
  id: string;
  title: string;
  category: string;
  created_at: string;
  visibility: string;
  item_count: number;
};

export async function listPublicPacks(category?: string) {
  const supabase = supabaseAdmin();
  let query = supabase
    .from('packs')
    .select('id,title,category,created_at,visibility,pack_items(count)')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query.limit(50);
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    created_at: row.created_at,
    visibility: row.visibility,
    item_count: Array.isArray(row.pack_items) && row.pack_items[0] ? row.pack_items[0].count ?? 0 : 0
  })) as PackCard[];
}

export async function getPackWithItems(packId: string) {
  const supabase = supabaseAdmin();
  const { data: pack, error: packError } = await supabase
    .from('packs')
    .select('id,title,category,visibility,created_at,owner_id')
    .eq('id', packId)
    .single();

  if (packError) throw packError;

  const { data: items, error: itemsError } = await supabase
    .from('pack_items')
    .select('id,name,created_at')
    .eq('pack_id', packId)
    .order('created_at', { ascending: true });

  if (itemsError) throw itemsError;

  return { pack, items: items ?? [] };
}

export async function ensureProfile(userId: string, email: string | null) {
  const supabase = supabaseAdmin();
  const fallbackName = email?.split('@')[0] ?? 'ranker';
  await supabase
    .from('profiles')
    .upsert({ user_id: userId, display_name: fallbackName }, { onConflict: 'user_id' });
}

export async function getResults(packId: string, viewerId?: string) {
  const supabase = supabaseAdmin();
  const { data: items, error: itemError } = await supabase
    .from('pack_items')
    .select('id,name')
    .eq('pack_id', packId)
    .order('created_at', { ascending: true });

  if (itemError) throw itemError;

  const { data: rankings, error: rankingError } = await supabase
    .from('rankings')
    .select('user_id,ordered_item_ids,submitted_at,updated_at')
    .eq('pack_id', packId)
    .order('updated_at', { ascending: false });

  if (rankingError) throw rankingError;

  const userIds = Array.from(new Set((rankings ?? []).map((row) => row.user_id)));
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('user_id,display_name').in('user_id', userIds)
    : { data: [] as Array<{ user_id: string; display_name: string | null }> };

  const nameById = new Map((profiles ?? []).map((p) => [p.user_id, p.display_name ?? 'Ranker']));
  const itemNameById = new Map((items ?? []).map((item) => [item.id, item.name]));
  const itemIds = (items ?? []).map((item) => item.id);

  const ballots = (rankings ?? []).map((row) => ({
    userId: row.user_id,
    orderedItemIds: (Array.isArray(row.ordered_item_ids) ? row.ordered_item_ids : []) as string[]
  }));

  const aggregate = bordaCount(itemIds, ballots).map((entry, index) => ({
    rank: index + 1,
    itemId: entry.itemId,
    itemName: itemNameById.get(entry.itemId) ?? entry.itemId,
    score: entry.score,
    averageRank: entry.averageRank
  }));

  const submissions = (rankings ?? []).map((row) => {
    const orderedItemIds = (Array.isArray(row.ordered_item_ids) ? row.ordered_item_ids : []) as string[];
    return {
      userId: row.user_id,
      displayName: nameById.get(row.user_id) ?? 'Ranker',
      submittedAt: row.submitted_at ?? row.updated_at,
      orderedItems: orderedItemIds.map((id) => ({ id, name: itemNameById.get(id) ?? id }))
    };
  });

  const viewerSubmission = viewerId
    ? submissions.find((submission) => submission.userId === viewerId) ?? null
    : null;

  return {
    submissions,
    aggregate,
    viewerSubmission,
    itemCount: itemIds.length,
    submissionCount: submissions.length
  };
}
