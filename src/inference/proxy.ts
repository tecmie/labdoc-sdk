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

export type CreateLabProxyOptions = {
  customHttpLink?: string;
  secretOrKey: string;
};

export const createLabProxy = ({
  secretOrKey,
  customHttpLink,
}: CreateLabProxyOptions): DecoratedProcedureRecord<any, AnyRouter> =>
  // @ts-ignore
  createTRPCProxyClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        // url: `http://localhost:3001/api/trpc`,
        url: customHttpLink ?? `https://labai.tecmie.africa/api/trpc`,
        /**
         * Headers will be called on each request.
         */
        headers: () => ({
          'x-secret': secretOrKey,
        }),
      }),
    ],
  });
