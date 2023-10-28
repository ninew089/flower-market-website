import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { slugify } from "@/features/shared/helpers/slugify";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const itemRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.item.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        price:true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return items;
  }),
  byId: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const items = await ctx.db.item.findUnique({
      where: { id: input },
      select: {
        id: true,
        slug: true,
        title: true,
        image: true,
        price:true,
      },
    });

    return items;
  }),
  bySlug: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const items = await ctx.db.item.findUnique({
      where: { slug: input },
      select: {
        id: true,
        slug: true,
        title: true,
        image: true,
        price:true,
      },
    });

    if (!items) throw new TRPCError({ code: "NOT_FOUND" });

    return items;
  }),
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        image: z.string(),
        excerpt: z.string(),
        content: z.string(),
        price:z.number()
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const items = await ctx.db.item.create({
        data: {
          ...input,
          slug: slugify(input.title),
          userId: 1,
        },
      });

      return items;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z
          .object({
            title: z.string(),
            image: z.string(),
            excerpt: z.string(),
            content: z.string(),
            price:z.number()
          })
          .partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const items = await ctx.db.item.update({
        where: { id: input.id },
        data: input.data.title
          ? { ...input.data, slug: slugify(input.data.title) }
          : input.data,
      });

      return items;
    }),
  remove: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    await ctx.db.item.delete({
      where: { id: input },
    });
  }),
});
