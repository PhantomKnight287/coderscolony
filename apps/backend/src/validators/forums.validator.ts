import * as JOI from 'joi';

export const CreateForumValidator = JOI.object({
  name: JOI.string().required(),
  slug: JOI.string().required(),
  profileURL: JOI.string().required(),
});
