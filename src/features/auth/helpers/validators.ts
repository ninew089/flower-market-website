import * as z from "zod";

export const login = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const register = login.merge(
  z.object({
    name: z.string().min(1).max(20),
    citizenId:z.string().min(13).max(13),
    tel:z.string()
  }),
);

export const profile = register
  .pick({ name: true, email: true })
  .merge(
    z.object({
      image: z.string(),
      password: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().min(8).optional(),
      ),
      tel:z.string()
    }),
  )
  .partial();
