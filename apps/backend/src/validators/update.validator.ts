import { z } from 'zod';

export const UpdateProfileValidator = z.object({
  username: z.string().optional(),
  color: z.string().optional(),
  email: z.string().email().optional(),
  oneLiner: z.string().optional(),
  name: z.string().optional(),
  tags: z.array(
    z.object({
      color: z.string().optional(),
      icon: z.string(),
      id: z.string(),
      name: z.string(),
    }),
  ),
});
