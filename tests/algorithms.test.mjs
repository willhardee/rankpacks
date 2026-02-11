import test from 'node:test';
import assert from 'node:assert/strict';

const bordaCount = (items, ballots) => {
  const mapBallot = (ballot) => {
    const m = new Map();
    ballot.orderedItemIds.forEach((id, i) => m.set(id, i + 1));
    items.forEach((id) => { if (!m.has(id)) m.set(id, items.length); });
    return m;
  };
  const maps = ballots.map(mapBallot);
  return items.map((itemId) => {
    const ranks = maps.map((m) => m.get(itemId));
    const score = ranks.reduce((sum, rank) => sum + (items.length - rank), 0);
    const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length;
    const variance = ranks.reduce((sum, r) => sum + (r - avg) ** 2, 0) / ranks.length;
    return { itemId, score, variance };
  }).sort((a,b)=>b.score-a.score);
};

const tasteTwins = (items, ballots) => {
  const rank = (ballot) => items.map((i) => ballot.orderedItemIds.indexOf(i) + 1 || items.length);
  const spearman = (a,b) => 1 - (6 * a.reduce((s,v,i)=>s + (v-b[i])**2,0)) / (a.length*(a.length**2 -1));
  let best = null;
  for(let i=0;i<ballots.length;i++) for(let j=i+1;j<ballots.length;j++) {
    const sim = spearman(rank(ballots[i]), rank(ballots[j]));
    if(!best || sim > best.similarity) best = { userA: ballots[i].userId, userB: ballots[j].userId, similarity: sim };
  }
  return best;
};

test('borda ranking ranks consensus winner first', () => {
  const stats = bordaCount(['a','b','c'], [
    { userId:'u1', orderedItemIds:['a','b','c'] },
    { userId:'u2', orderedItemIds:['b','a','c'] }
  ]);
  assert.equal(stats[0].itemId, 'a');
});

test('controversy uses variance', () => {
  const stats = bordaCount(['a','b','c'], [
    { userId:'u1', orderedItemIds:['a','b','c'] },
    { userId:'u2', orderedItemIds:['c','b','a'] }
  ]);
  assert.ok(stats.find((s) => s.itemId === 'a').variance > 0);
});

test('taste twins returns best similarity pair', () => {
  const twins = tasteTwins(['a','b','c'], [
    { userId:'u1', orderedItemIds:['a','b','c'] },
    { userId:'u2', orderedItemIds:['a','b','c'] },
    { userId:'u3', orderedItemIds:['c','b','a'] }
  ]);
  assert.equal(twins.userA, 'u1');
  assert.equal(twins.userB, 'u2');
});
