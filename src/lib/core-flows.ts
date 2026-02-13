import { supabaseAdmin } from '@/lib/supabase';
import { bordaCount, type RankingBallot } from '@/lib/ranking';

export type PackCard = {
  id: string;
  title: string;
  category: string;
  visibility: 'public' | 'link-only';
  created_at: string;
  items_count: number;
};

export type PackDetail = {
  id: string;
  title: string;
  category: string;
  visibility: 'public' | 'link-only';
  creator_name: string | null;
  created_at: string;
  items: { id: string; name: string }[];
};

export type RankingSubmission = {
  id: string;
  display_name: string;
  ordered_item_ids: string[];
  submitted_at: string;
};

const hasServerSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

const demoPack: PackDetail = {
  id: 'demo-pack',
  title: 'Demo Snack Draft',
  category: 'snacks',
  visibility: 'public',
  creator_name: 'RankPacks Team',
  created_at: new Date().toISOString(),
  items: [
    { id: 'a', name: 'Chili Chips' },
    { id: 'b', name: 'Salted Pretzels' },
    { id: 'c', name: 'Dark Chocolate Bites' }
  ]
};

export async function listPublicPacks({ category, sort = 'recent' }: { category?: string; sort?: 'recent' | 'oldest' }) {
  if (!hasServerSupabase) {
    return [{ id: demoPack.id, title: demoPack.title, category: demoPack.category, visibility: demoPack.visibility, created_at: demoPack.created_at, items_count: demoPack.items.length } satisfies PackCard];
  }

  let query = supabaseAdmin()
    .from('packs')
    .select('id,title,category,visibility,created_at,pack_items(count)')
    .eq('visibility', 'public');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  query = sort === 'oldest' ? query.order('created_at', { ascending: true }) : query.order('created_at', { ascending: false });

  const { data, error } = await query.limit(50);
  if (error) return [];

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    visibility: row.visibility,
    created_at: row.created_at,
    items_count: row.pack_items?.[0]?.count ?? 0
  })) as PackCard[];
}

export async function getPack(packId: string): Promise<PackDetail | null> {
  if (!hasServerSupabase) {
    return packId === demoPack.id ? demoPack : null;
  }

  const { data: pack, error } = await supabaseAdmin()
    .from('packs')
    .select('id,title,category,visibility,creator_name,created_at')
    .eq('id', packId)
    .maybeSingle();

  if (error || !pack) return null;

  const { data: items } = await supabaseAdmin()
    .from('pack_items')
    .select('id,name,position')
    .eq('pack_id', packId)
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  return {
    ...(pack as any),
    items: (items ?? []).map((item: any) => ({ id: item.id, name: item.name }))
  } as PackDetail;
}

export async function listPackSubmissions(packId: string): Promise<RankingSubmission[]> {
  if (!hasServerSupabase) {
    return [
      { id: '1', display_name: 'Alex', ordered_item_ids: ['a', 'b', 'c'], submitted_at: new Date().toISOString() },
      { id: '2', display_name: 'Sam', ordered_item_ids: ['b', 'a', 'c'], submitted_at: new Date().toISOString() },
      { id: '3', display_name: 'Jordan', ordered_item_ids: ['a', 'c', 'b'], submitted_at: new Date().toISOString() }
    ];
  }

  const { data, error } = await supabaseAdmin()
    .from('ranking_submissions')
    .select('id,display_name,ordered_item_ids,submitted_at')
    .eq('pack_id', packId)
    .order('submitted_at', { ascending: false })
    .limit(100);

  if (error) return [];

  return (data ?? []).map((row: any) => ({
    id: row.id,
    display_name: row.display_name ?? 'Guest',
    ordered_item_ids: Array.isArray(row.ordered_item_ids) ? row.ordered_item_ids : [],
    submitted_at: row.submitted_at
  }));
}

export function aggregatePackResults(itemIds: string[], submissions: RankingSubmission[]) {
  const ballots: RankingBallot[] = submissions.map((entry) => ({ userId: entry.display_name, orderedItemIds: entry.ordered_item_ids }));
  return bordaCount(itemIds, ballots);
}

export async function createPackRecord(input: { title: string; category: string; visibility: 'public' | 'link-only'; items: string[]; creatorName?: string }) {
  if (!hasServerSupabase) {
    return { id: demoPack.id };
  }

  const { data: pack, error } = await supabaseAdmin()
    .from('packs')
    .insert({
      title: input.title,
      category: input.category,
      visibility: input.visibility,
      status: 'open',
      creator_name: input.creatorName ?? 'Guest'
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (input.items.length > 0) {
    const rows = input.items.map((name, idx) => ({ pack_id: pack.id, name, position: idx + 1 }));
    const { error: itemError } = await supabaseAdmin().from('pack_items').insert(rows);
    if (itemError) throw new Error(itemError.message);
  }

  return { id: pack.id as string };
}

export async function submitRanking(input: { packId: string; orderedItemIds: string[]; displayName?: string }) {
  if (!hasServerSupabase) return { ok: true };

  const { error } = await supabaseAdmin().from('ranking_submissions').insert({
    pack_id: input.packId,
    ordered_item_ids: input.orderedItemIds,
    display_name: input.displayName || 'Guest'
  });

  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function adminDebugSnapshot() {
  if (!hasServerSupabase) {
    return {
      counts: { packs: 1, items: 3, submissions: 3 },
      recentPacks: [demoPack],
      recentSubmissions: await listPackSubmissions(demoPack.id)
    };
  }

  const [packsCount, itemsCount, submissionsCount, recentPacks, recentSubmissions] = await Promise.all([
    supabaseAdmin().from('packs').select('*', { count: 'exact', head: true }),
    supabaseAdmin().from('pack_items').select('*', { count: 'exact', head: true }),
    supabaseAdmin().from('ranking_submissions').select('*', { count: 'exact', head: true }),
    supabaseAdmin().from('packs').select('id,title,category,visibility,created_at').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin().from('ranking_submissions').select('id,pack_id,display_name,submitted_at').order('submitted_at', { ascending: false }).limit(10)
  ]);

  return {
    counts: {
      packs: packsCount.count ?? 0,
      items: itemsCount.count ?? 0,
      submissions: submissionsCount.count ?? 0
    },
    recentPacks: recentPacks.data ?? [],
    recentSubmissions: recentSubmissions.data ?? []
  };
}
