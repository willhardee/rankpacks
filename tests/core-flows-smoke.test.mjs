import test from 'node:test';
import assert from 'node:assert/strict';

const aggregate = (itemIds, submissions) => {
  const scores = new Map(itemIds.map((id) => [id, { score: 0, topVotes: 0, rankTotal: 0 }]));

  submissions.forEach((submission) => {
    itemIds.forEach((itemId, idx) => {
      const rank = submission.ordered_item_ids.indexOf(itemId) + 1 || itemIds.length;
      const entry = scores.get(itemId);
      entry.score += itemIds.length - rank;
      entry.rankTotal += rank;
      if (rank === 1) entry.topVotes += 1;
    });
  });

  return itemIds
    .map((itemId) => ({
      itemId,
      score: scores.get(itemId).score,
      averageRank: scores.get(itemId).rankTotal / submissions.length,
      topVotes: scores.get(itemId).topVotes
    }))
    .sort((a, b) => b.score - a.score || a.averageRank - b.averageRank);
};

test('smoke: aggregate supports showing consensus and individuals', () => {
  const items = ['a', 'b', 'c'];
  const submissions = [
    { display_name: 'Alex', ordered_item_ids: ['a', 'b', 'c'] },
    { display_name: 'Sam', ordered_item_ids: ['b', 'a', 'c'] },
    { display_name: 'Jordan', ordered_item_ids: ['a', 'c', 'b'] }
  ];

  const ranked = aggregate(items, submissions);

  assert.equal(ranked.length, 3);
  assert.equal(ranked[0].itemId, 'a');
  assert.equal(submissions.length, 3);
  assert.ok(submissions.every((entry) => entry.display_name && entry.ordered_item_ids.length === 3));
});
