import { z } from 'zod';

export const CreateNewSeries = z.object({
  name: z.string({
    required_error: 'Name of Series is Required',
    invalid_type_error: 'Name of Series must be string',
  }),
});

export const AddNewBlogInSeries = z.object({
  slug: z.string({
    required_error: 'Slug of Blog is Required',
    invalid_type_error: 'Slug of Blog must be string',
  }),
});
