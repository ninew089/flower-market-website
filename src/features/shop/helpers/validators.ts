import * as z from "zod";



export const shopItems = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt:z.string(),
  content:z.string(),
  price:z.number(),
  image:z.string(),
});

