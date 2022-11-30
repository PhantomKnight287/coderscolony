import * as JOI from 'joi';

export const CreateBlogValidator = JOI.object({
  title: JOI.string().required(),
  content: JOI.string().required(),
  tags: JOI.array().items(JOI.string()),
  ogImage: JOI.string().required(),
  description: JOI.string().required(),
});
