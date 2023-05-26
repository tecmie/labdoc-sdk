import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import {
  type inferRouterInputs,
  type inferRouterOutputs,
  AnyRouter,
  ProcedureRouterRecord,
  AnyProcedure,
} from '@trpc/server';
import { DecorateProcedure } from '@trpc/react-query/shared';

type AppRouter = AnyRouter;
export const trpc = createTRPCReact<AppRouter>();

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


type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TRouter extends AppRouter,
> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<
        TProcedures[TKey]['_def']['record'],
        TProcedures[TKey]
      >
    : TProcedures[TKey] extends AnyProcedure
    ? DecorateProcedure<TProcedures[TKey], any>
    : never;
};

// @ts-ignore
export const proxy: DecoratedProcedureRecord<any, AppRouter> = createTRPCProxyClient({
  
  // transformer: superjson,
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `https://labai.tecmie.africa/api/trpc`,
      /**
       * Headers will be called on each request.
       */
      headers: () => ({
        'x-secret': process.env.NEXT_PUBLIC_SECRET || '',
      }),
    }),
  ],
})