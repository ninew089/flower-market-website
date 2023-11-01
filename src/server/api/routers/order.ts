import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const orderRouter = createTRPCRouter({
  orderByShopId: protectedProcedure.query(async ({ input, ctx }) => {
    const order = await ctx.db.order.findMany({
      where: {
        shopId: +ctx.session.user.id,
      },
      include: {
        user: true,
        sale: {
          include: {
            item: true,
          },
        },
      },
    });
    return order;
  }),
  orderByCustomerId: protectedProcedure.query(async ({ input, ctx }) => {
    const order = await ctx.db.order.findMany({
      where: {
        userId: +ctx.session.user.id,
      },
      include: {
        shop: true,
        sale: {
          include: {
            item: true,
          },
        },
      },
    });
    return order;
  }),
});
