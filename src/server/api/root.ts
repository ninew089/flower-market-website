import { createTRPCRouter } from '@/server/api/trpc';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { authRouter } from '@/server/api/routers/auth';
import { itemRouter } from '@/server/api/routers/item';
import { saleRouter } from './routers/sale';
import { adminRoute } from './routers/admin';
import { orderRouter } from './routers/order';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  item: itemRouter,
  sale: saleRouter,
  admin: adminRoute,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
