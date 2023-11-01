import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const saleRouter = createTRPCRouter({
  orderById: protectedProcedure.query(async ({ input, ctx }) => {
    const sales = await ctx.db.sale.findMany({
      where: {
        userId: +ctx.session.user.id,
      },
      orderBy: {
        saleTime: 'asc',
      },
    });
    return sales;
  }),
  orderBySeller: protectedProcedure.query(async ({ input, ctx }) => {
    const sales = await ctx.db.sale.findMany({
      where: {
        userId: +ctx.session.user.id,
      },
      orderBy: {
        saleTime: 'asc',
      },
    });
    const customerId = sales.map((x) => x.customerId);
    const customer = await ctx.db.user.findMany({
      where: {
        id: { in: customerId },
      },
      select: {
        id: true,
        name: true,
        tel: true,
        address: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    const order = sales.map((x) => {
      const customerInfo = customer.find((c) => c?.id === x.customerId);
      return {
        ...x,
        customerName: customerInfo?.name,
        tel: customerInfo?.tel,
        address: customerInfo?.address,
      };
    });
    return order;
  }),
  byUserId: protectedProcedure.query(async ({ input, ctx }) => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const sales = await ctx.db.sale.findMany({
      where: {
        userId: +ctx.session.user.id,
        saleTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        saleTime: 'asc',
      },
    });

    const seriesMap: any = {};
    const timestampSet: string[] = [];

    sales.forEach(async (record) => {
      const { saleTime, price, itemName } = record;
      const formattedSaleTime = new Date(saleTime).toString();
      if (!timestampSet.includes(formattedSaleTime)) {
        timestampSet.push(formattedSaleTime);
      }

      const seriesName = itemName;
      if (!seriesMap[seriesName]) {
        seriesMap[seriesName] = Array(timestampSet.length).fill(0);
      }
      const indexTime = timestampSet.findIndex((x) => x === formattedSaleTime);
      seriesMap[seriesName][indexTime] = price;
    });

    const seriesData = Object.entries(seriesMap).map(([key, value]) => ({
      name: key,
      data: value as number[],
    }));

    return { series: seriesData, categories: timestampSet };
  }),
});
