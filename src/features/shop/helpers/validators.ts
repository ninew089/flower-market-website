import { validateInput } from '@/utils/validate';
import * as z from 'zod';

export const shopItems = z.object({
  title: z.string().refine((val) => validateInput(val), {
    message: 'Should not using special characters',
  }),
  slug: z.string().refine((val) => validateInput(val), {
    message: 'Should not using special characters',
  }),
  excerpt: z.string().refine((val) => validateInput(val), {
    message: 'Should not using special characters',
  }),
  content: z.string().refine((val) => validateInput(val), {
    message: 'Should not using special characters',
  }),
  available: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  stock: z.number(),
  price: z.number(),
  image: z.string(),
});
