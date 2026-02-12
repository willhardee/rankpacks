const blocked = ['idiot', 'hate', 'stupid'];

export const containsProfanity = (input: string) => {
  const lower = input.toLowerCase();
  return blocked.some((word) => lower.includes(word));
};
