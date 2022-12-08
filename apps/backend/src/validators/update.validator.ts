import { z } from 'zod';

export const UpdateProfileValidator = z.object({
  username: z.string().optional(),
  color: z.string().optional(),
  email: z.string().email().optional(),
  oneLiner: z.string().optional(),
  name: z.string().optional(),
});
