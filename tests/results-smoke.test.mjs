import test from 'node:test';
import assert from 'node:assert/strict';

const aggregate = (items, ballots) => {
  const scores = new Map(items.map((item) => [item, 0]));
  ballots.forEach((ballot) => {
    ballot.forEach((itemId, index) => {
      scores.set(itemId, (scores.get(itemId) ?? 0) + (items.length - (index + 1)));
    });
  });
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([itemId]) => itemId);
};

test('smoke: aggregate ranking gives deterministic order', () => {
  const items = ['chips', 'cookies', 'pretzels'];
  const ballots = [
    ['chips', 'cookies', 'pretzels'],
    ['cookies', 'chips', 'pretzels'],
    ['chips', 'pretzels', 'cookies']
  ];

  assert.deepEqual(aggregate(items, ballots), ['chips', 'cookies', 'pretzels']);
});
