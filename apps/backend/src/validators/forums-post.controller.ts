import * as JOI from 'joi';

export const CreatePostValidator = JOI.object({
  content: JOI.string().required(),
  slug: JOI.string().required(),
});
