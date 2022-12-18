import { z } from 'zod';

export const CreateInterestValidator = z.object({
  color: z.string().optional(),
  icon: z.string(),
  name: z.string(),
});
