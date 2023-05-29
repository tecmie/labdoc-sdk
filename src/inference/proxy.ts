import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import { AnyRouter, ProcedureRouterRecord, AnyProcedure } from '@trpc/server';
import { DecorateProcedure } from '@trpc/react-query/shared';

type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TRouter extends AnyRouter
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
export const proxy: DecoratedProcedureRecord<any, AnyRouter> =
  createTRPCProxyClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        // url: `http://localhost:3001/api/trpc`,
        url: `https://labai.tecmie.africa/api/trpc`,
        /**
         * Headers will be called on each request.
         */
        headers: () => ({
          'x-secret':
            process.env.NEXT_PUBLIC_SECRET ||
            'sk_P9uPoekyZLV5MEUHCsgPZ4DTmp99m8DUoxy4SpVzSkDsi2azKJ6mhN83',
        }),
      }),
    ],
  });
