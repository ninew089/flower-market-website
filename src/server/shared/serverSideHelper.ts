import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '../api/root';
import { db } from '@/server/db';

export const generateServerSideHelper = () => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { db, session: null },
    transformer: superjson,
  });
};
