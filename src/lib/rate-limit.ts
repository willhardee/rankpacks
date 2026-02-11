const memory = new Map<string, number[]>();

export const rateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const items = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  if (items.length >= limit) return false;
  items.push(now);
  memory.set(key, items);
  return true;
};
