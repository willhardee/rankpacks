export type RankingBallot = { userId: string; orderedItemIds: string[] };

export type ItemStats = {
  itemId: string;
  score: number;
  averageRank: number;
  topVotes: number;
  variance: number;
};

const rankMap = (items: string[], ballot: RankingBallot) => {
  const map = new Map<string, number>();
  ballot.orderedItemIds.forEach((id, index) => map.set(id, index + 1));
  items.forEach((id) => {
    if (!map.has(id)) map.set(id, items.length);
  });
  return map;
};

export const bordaCount = (items: string[], ballots: RankingBallot[]): ItemStats[] => {
  if (items.length === 0) return [];

  const rankMaps = ballots.map((b) => rankMap(items, b));

  const scored = items.map((itemId) => {
    const ranks = rankMaps.map((map) => map.get(itemId) ?? items.length);
    const score = ranks.reduce((sum, rank) => sum + (items.length - rank), 0);
    const averageRank = ranks.reduce((a, b) => a + b, 0) / Math.max(ranks.length, 1);
    const topVotes = ranks.filter((r) => r === 1).length;
    const variance = ranks.reduce((sum, r) => sum + (r - averageRank) ** 2, 0) / Math.max(ranks.length, 1);
    return { itemId, score, averageRank, topVotes, variance };
  });

  return scored.sort((a, b) => b.score - a.score || a.averageRank - b.averageRank);
};

export const mostControversialItem = (stats: ItemStats[]) =>
  stats.reduce<ItemStats | null>((current, item) => {
    if (!current) return item;
    return item.variance > current.variance ? item : current;
  }, null);

const spearman = (a: number[], b: number[]) => {
  const n = a.length;
  if (!n) return 0;
  const dSquared = a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0);
  return 1 - (6 * dSquared) / (n * (n ** 2 - 1));
};

export const tasteTwins = (items: string[], ballots: RankingBallot[]) => {
  const rankMaps = ballots.map((b) => ({
    userId: b.userId,
    ranks: items.map((i) => b.orderedItemIds.indexOf(i) + 1 || items.length)
  }));

  let best: { userA: string; userB: string; similarity: number } | null = null;

  for (let i = 0; i < rankMaps.length; i += 1) {
    for (let j = i + 1; j < rankMaps.length; j += 1) {
      const similarity = spearman(rankMaps[i].ranks, rankMaps[j].ranks);
      if (!best || similarity > best.similarity) {
        best = { userA: rankMaps[i].userId, userB: rankMaps[j].userId, similarity };
      }
    }
  }

  return best;
};
