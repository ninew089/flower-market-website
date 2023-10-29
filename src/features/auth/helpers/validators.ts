import * as z from 'zod';

export const validationTel = (val: string) => {
  return /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(val);
};

export const validateInput = (val: string) => {
  return /^[^=+\@|>%<]*$/.test(val);
};

export const login = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const citizenId = z
  .string()
  .min(13)
  .max(13)
  .refine((id) => id.length === 13, {
    message: 'Invalid critizen ID',
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
      message: 'Invalid critizen ID',
    },
  );

const tel = z.string().refine((val) => validationTel(val), {
  message: 'Invalid telephone number',
});

export const register = (isAPI: boolean) =>
  login.merge(
    z.object({
      name: z
        .string()
        .min(1)
        .max(20)
        .refine((val) => validateInput(val), {
          message: 'Should not using special characters',
        }),
      citizenId: isAPI ? z.string() : citizenId,
      tel: isAPI ? z.string() : tel,
    }),
  );

export const profile = (isAPI: boolean) =>
  register(isAPI)
    .pick({ name: true, email: true })
    .merge(
      z.object({
        image: z.string(),
        password: z.preprocess(
          (v) => (v === '' ? undefined : v),
          z.string().min(8).optional(),
        ),
        tel: isAPI ? z.string() : tel,
      }),
    )
    .partial();
