import { leaveRouter } from "@/server/api/routers/leave";
import { createTRPCRouter } from "@/server/api/trpc";
import { articleRouter } from "@/server/api/routers/article";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { announcementRouter } from "@/server/api/routers/announcement";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  article: articleRouter,
  leave: leaveRouter,
  announcement: announcementRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
