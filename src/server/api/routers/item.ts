import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { slugify } from '@/features/shared/helpers/slugify';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import * as validators from '@/features/shop/helpers/validators';
import { aesDecrypt, aesEncrypt } from '@/utils/encrypt';
import Fuse from 'fuse.js';

export const itemRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      const searchQuery = input || '';
      const items = await ctx.db.item.findMany({
        select: {
          id: true,
          productName: true,
          slug: true,
          image: true,
          price: true,
          available: true,
          stock: true,
          sold: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      const decryptedItems = items.map((item) => ({
        ...item,
        image: aesDecrypt(item.image),
      }));
      const fuse = new Fuse(decryptedItems, {
        keys: ['productName', 'slug', 'id'],
        threshold: 0.3,
      });

      // Perform the search
      const searchResults = searchQuery
        ? fuse.search(searchQuery).map((x) => x.item)
        : decryptedItems; // If no query is provided, return all items

      return searchResults;
    }),
  findStockList: publicProcedure
    .input(z.array(z.number()))
    .query(async ({ input, ctx }) => {
      const items = await ctx.db.item.findMany({
        where: {
          id: { in: input },
        },
        select: {
          stock: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return items;
    }),
  recommendList: publicProcedure.query(async ({ input, ctx }) => {
    const items = await ctx.db.item.findMany({
      where: {
        available: true,
      },
      select: {
        id: true,
        productName: true,
        slug: true,
        image: true,
        price: true,
        available: true,
        stock: true,
        sold: true,
      },
      orderBy: {
        sold: 'desc',
      },
      take: 4,
    });
    const decryptedItems = items.map((item) => ({
      ...item,
      image: aesDecrypt(item.image),
    }));

    return decryptedItems;
  }),
  byUserId: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const items = await ctx.db.item.findMany({
      where: { userId: input },
      select: {
        id: true,
        slug: true,
        productName: true,
        image: true,
        price: true,
        available: true,
        stock: true,
        sold: true,
      },
    });
    const shopName = await ctx.db.user.findUnique({
      where: { id: input },
      select: {
        name: true,
        id: true,
        image: true,
      },
    });
    if (items === null) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    const decryptedItems = items.map((item) => ({
      ...item,
      image: aesDecrypt(item.image),
    }));

    return { items: decryptedItems, shopInfo: shopName };
  }),
  byUserIdWithStatic: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const items = await ctx.db.item.findMany({
        where: { userId: input },
        select: {
          id: true,
          slug: true,
          productName: true,
          image: true,
          price: true,
          viewer: true,
          sold: true,
          available: true,
          stock: true,
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
        productName: true,
        image: true,
        price: true,
        sold: true,
        content: true,
        excerpt: true,
        available: true,
        stock: true,
      },
    });
    if (item === null) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return { ...item, image: aesDecrypt(item.image) };
  }),
  bySlug: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const items = await ctx.db.item.findFirst({
      where: { slug: input },
      select: {
        id: true,
        slug: true,
        productName: true,
        image: true,
        price: true,
        sold: true,
        content: true,
        excerpt: true,
        userId: true,
        available: true,
        stock: true,
      },
    });

    const userInfo = await ctx.db.user.findFirst({
      where: { id: items?.userId },
      select: {
        id: true,
        name: true,
      },
    });
    if (!items) throw new TRPCError({ code: 'NOT_FOUND' });

    return { ...items, image: aesDecrypt(items.image), name: userInfo?.name };
  }),
  add: protectedProcedure
    .input(validators.shopItems)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.item.create({
        data: {
          ...input,
          image: aesEncrypt(input.image),
          slug: slugify(input.slug),
          userId: +ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: validators.shopItems.partial(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const items = await ctx.db.item.update({
        where: { id: input.id },
        data: {
          ...input.data,
          image: input.data.image ? aesEncrypt(input.data.image) : undefined,
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
      //check stock
      for (let i = 0; i < input.length; i++) {
        const item = await ctx.db.item.findUnique({
          where: { id: input[i]?.id },
        });
        if (item === null || typeof input[i] === 'undefined') {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        if (
          typeof input[i]?.total === 'number' &&
          item.stock < (input[i]?.total ?? 0)
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Some Product out of stock, Please remove product`,
          });
        }
      }
      const saleTime = new Date();
      //update
      for (let i = 0; i < input.length; i++) {
        if (typeof input[i] === 'undefined') return;
        const item = await ctx.db.item.findUnique({
          where: { id: input[i]?.id },
        });
        if (item === null || typeof input[i] === 'undefined') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        await ctx.db.sale.create({
          data: {
            itemId: +item.id,
            itemName: item.productName,
            userId: +item.userId,
            quantity: input[i]?.total ?? 0,
            price: (input[i]?.total ?? 0) * item.price,
            customerId: +ctx.session.user.id,
            saleTime: saleTime,
          },
        });

        await ctx.db.item.update({
          where: { id: input[i]?.id },
          data: {
            ...item,
            available: item.stock - (input[i]?.total ?? 0) > 0,
            sold: (item.sold ?? 0) + (input[i]?.total ?? 0),
            stock: item.stock - (input[i]?.total ?? 0),
          },
        });
      }
    }),
});
