import { z } from 'zod';

export const CreateCommentValidator = z.object({
  content: z.string().min(1),
});
