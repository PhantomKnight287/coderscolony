import { z } from 'zod';

export const CreateNewSeries = z.object({
  image: z
    .string({
      required_error: 'Image of Series is Required',
      invalid_type_error: 'Image of Series must be string',
    })
    .optional()
    .nullable(),
  description: z.string({
    required_error: 'Description of Series is Required',
    invalid_type_error: 'Description of Series must be string',
  }),
  title: z.string({
    required_error: 'Title of Series is Required',
    invalid_type_error: 'Title of Series must be string',
  }),
});

export const AddNewBlogInSeries = z.object({
  slug: z.string({
    required_error: 'Slug of Blog is Required',
    invalid_type_error: 'Slug of Blog must be string',
  }),
});
