import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { aesDecrypt } from '@/utils/encrypt';
import { Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const adminRoute = createTRPCRouter({
  overview: protectedProcedure
    .meta({ roles: ['ADMIN'] })
    .query(async ({ ctx }) => {
      const users = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          tel: true,
          email: true,
          role: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      const sales = await ctx.db.sale.findMany({
        orderBy: {
          userId: 'asc',
        },
      });

      const overviewSale = sales.reduce(
        (prev, cur) => {
          prev[cur.userId] = {
            price: (prev[cur.userId]?.price ?? 0) + cur.price,
          };
          return prev;
        },
        {} as { [key: number]: { price: number } },
      );

      const overview = users.map((x) => ({
        ...x,
        tel: aesDecrypt(x.tel),
        sale: overviewSale[x.id]?.price ?? 0,
      }));
      return overview;
    }),
});
