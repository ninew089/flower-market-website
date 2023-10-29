import { validateInput } from '@/utils/validate';
import * as z from 'zod';

export const login = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const citizenId = z
  .string()
  .min(13)
  .max(13)
  .refine((id) => id.length === 13, {
    message: 'valid critizen ID',
  })
  .refine(
    (id) => {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseFloat(id.charAt(i)) * (13 - i);
      }
      return (11 - (sum % 11)) % 10 === parseFloat(id.charAt(12));
    },
    {
      message: 'valid critizen ID',
    },
  );

export const registerUI = login.merge(
  z.object({
    name: z
      .string()
      .min(1)
      .max(20)
      .refine((val) => validateInput(val), {
        message: 'Should not using special characters',
      }),
    citizenId: citizenId,
    tel: z.string().refine((val) => validateInput(val), {
      message: 'Should not using special characters',
    }),
  }),
);

export const register = login.merge(
  z.object({
    name: z.string().min(1).max(20),
    citizenId: z.string(),
    tel: z.string(),
  }),
);

export const profile = register
  .pick({ name: true, email: true })
  .merge(
    z.object({
      image: z.string(),
      password: z.preprocess(
        (v) => (v === '' ? undefined : v),
        z.string().min(8).optional(),
      ),
      tel: z.string(),
    }),
  )
  .partial();
