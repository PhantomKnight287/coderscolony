import * as JOI from 'joi';
import { z } from 'zod';
export const CreateBlogValidator = JOI.object({
  title: JOI.string().required(),
  content: JOI.string().required(),
  tags: JOI.array().items(JOI.string()),
  ogImage: JOI.string().required(),
  description: JOI.string().required(),
});

export const EditBlogValidator = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  description: z.string(),
});
