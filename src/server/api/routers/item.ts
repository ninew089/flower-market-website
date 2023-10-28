import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { slugify } from '@/features/shared/helpers/slugify';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { shopItems } from '@/features/shop/helpers/validators';
import { aesDecrypt, aesEncrypt } from '@/utils/encrypt';

export const itemRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.item.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        price: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const decryptedItems = items.map((item) => ({
      ...item,
      image: aesDecrypt(item.image),
    }));

    return decryptedItems;
  }),
  byUserId: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const items = await ctx.db.item.findMany({
        where: { userId: input },
        select: {
          id: true,
          slug: true,
          title: true,
          image: true,
          price: true,
        },
      });
      if (items === null) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      const decryptedItems = items.map((item) => ({
        ...item,
        image: aesDecrypt(item.image),
      }));

      return decryptedItems;
    }),
  byUserIdWithStatic: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const items = await ctx.db.item.findMany({
        where: { userId: input },
        select: {
          id: true,
          slug: true,
          title: true,
          image: true,
          price: true,
          viewer: true,
          sold: true,
        },
        orderBy: {
          sold: 'desc',
        },
      });
      if (items === null) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      const totalPrice = items.reduce(
        (accumulator, product) =>
          accumulator + product.price * (product.sold ?? 0),
        0,
      );
      const decryptedItems = items.map((item) => ({
        ...item,
        image: aesDecrypt(item.image), // Replace with the appropriate key
      }));

      return { listItems: decryptedItems, totalSell: totalPrice };
    }),
  byId: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const item = await ctx.db.item.findFirst({
      where: { id: input },
      select: {
        id: true,
        slug: true,
        title: true,
        image: true,
        price: true,
        sold: true,
        content: true,
        excerpt: true,
      },
    });
    if (item === null) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return { ...item, image: aesDecrypt(item.image) };
  }),
  bySlug: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const items = await ctx.db.item.findUnique({
      where: { slug: input },
      select: {
        id: true,
        slug: true,
        title: true,
        image: true,
        price: true,
        sold: true,
        content: true,
        excerpt: true,
        userId: true,
      },
    });

    const userInfo = await ctx.db.user.findUnique({
      where: { id: items?.userId },
      select: {
        id: true,
        name: true,
      },
    });
    if (!items) throw new TRPCError({ code: 'NOT_FOUND' });
    const decryptedItems = {
      ...items,
      image: aesDecrypt(items.image),
    };
    return { ...decryptedItems, ...userInfo };
  }),
  add: protectedProcedure.input(shopItems).mutation(async ({ input, ctx }) => {
    await ctx.db.item.create({
      data: {
        ...input,
        image: aesEncrypt(input.image),
        slug: slugify(input.slug),
        userId: +ctx.session.user.id,
      },
    });

    return { ...input, userId: +ctx.session.user.id };
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z
          .object({
            title: z.string(),
            image: z.string(),
            excerpt: z.string(),
            content: z.string(),
            price: z.number(),
          })
          .partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const items = await ctx.db.item.update({
        where: { id: input.id },
        data: input.data.title
          ? {
              ...input.data,
              image: input.data.image
                ? aesEncrypt(input.data.image)
                : undefined,
              slug: slugify(input.data.title),
            }
          : {
              ...input.data,
              image: input.data.image
                ? aesEncrypt(input.data.image)
                : undefined,
            },
      });

      return items;
    }),
  view: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const prevItem = await ctx.db.item.findUnique({
      where: { id: input },
    });
    const items = await ctx.db.item.update({
      where: { id: input },
      data: { ...prevItem, viewer: (prevItem?.viewer ?? 0) + 1 },
    });
    return items;
  }),
  remove: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.db.item.findUnique({
        where: { id: input },
      });
      // ABAC => Attribute-Based Access Control
      if (item?.userId !== +ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      await ctx.db.item.delete({
        where: { id: input },
      });
    }),
  buy: protectedProcedure
    .input(z.array(z.object({ id: z.number(), total: z.number() })))
    .mutation(async ({ input, ctx }) => {
      for (let i = 0; i < input.length - 1; i++) {
        if (typeof input[i] === 'undefined') return;
        const item = await ctx.db.item.findUnique({
          where: { id: input[i]?.id },
        });
        await ctx.db.item.update({
          where: { id: input[i]?.id },
          data: { ...item, sold: (item?.sold ?? 0) + (input[i]?.total ?? 0) },
        });
      }
    }),
});
