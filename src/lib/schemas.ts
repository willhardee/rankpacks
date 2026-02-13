import { z } from 'zod';

export const packSchema = z.object({
  title: z.string().min(3).max(120),
  category: z.enum(['snacks', 'wine', 'fast-food', 'coffee', 'movies', 'custom']),
  visibility: z.enum(['link-only', 'public']),
  itemsText: z.string().optional(),
  items: z.union([z.array(z.string()), z.string()]).optional(),
  creatorName: z.string().max(80).optional(),
  location: z.string().max(140).optional(),
  scheduledFor: z.string().datetime().optional()
});

export const commentSchema = z.object({
  packId: z.string().uuid(),
  body: z.string().min(1).max(500)
});
