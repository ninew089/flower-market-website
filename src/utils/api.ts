/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import Router from 'next/router';
import superjson from 'superjson';
import { isTRPCClientError } from '@/features/shared/helpers/error';
import { useAppStore } from '@/features/store';
import { type UiSlice } from '@/features/ui/slice';

import { type AppRouter } from '@/server/api/root';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
const retryHandling = (error: unknown) => {
  if (isTRPCClientError(error)) {
    const code = error.shape?.data.code;

    if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN') {
      return false;
    }
  }

  return true;
};

const errorHandling = (error: unknown, setUiToast: UiSlice['setUiToast']) => {
  if (isTRPCClientError(error)) {
    const code = error.shape?.data.code;

    if (code === 'FORBIDDEN') {
      void Router.push('/403');
      return setUiToast({
        type: 'Error',
        message: 'You are not allowed to access this page.',
      });
    }

    if (code === 'UNAUTHORIZED') {
      void Router.push('/auth/sign-in');
      return setUiToast({
        type: 'Error',
        message: 'Please login first.',
      });
    }
  } else if (error instanceof Error) {
    return setUiToast({ type: 'Error', message: error.message });
  }
};

export const api = createTRPCNext<AppRouter>({
  config() {
    useAppStore.getState().setUiToast;
    const setUiToast = useAppStore.getState().setUiToast;

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry(_failureCount, error) {
              return retryHandling(error);
            },
            onError(error) {
              return errorHandling(error, setUiToast);
            },
          },
          mutations: {
            retry(_failureCount, error) {
              return retryHandling(error);
            },
            onError(error) {
              return errorHandling(error, setUiToast);
            },
          },
        },
      },
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
