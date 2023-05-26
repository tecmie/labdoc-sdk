import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';

// import { type AppRouter } from "../server/trpc/router/_app";

type AppRouter = any;

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.INFERENCE_URL) return `https://${process.env.INFERENCE_URL}`; // SSR should use vercel url
  return `https://labai.tecmie.africa`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    transformer: superjson,
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        /**
         * Headers will be called on each request.
         */
        headers: () => ({
          'x-secret': process.env.INFERENCE_SECRET,
        }),
      }),
    ],
  }),
  ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 * */
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 * */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
