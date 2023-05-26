import { httpBatchLink, loggerLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import superjson from 'superjson';
import { trpc } from './trpc';

type ProviderProps = {
  children: React.ReactNode;
  defaultQueryClient?: QueryClient;
  httpRpcURL?: string;
  secret: string;
};

export const LabAIClientProvider = ({
  children,
  defaultQueryClient,
  httpRpcURL,
  secret,
}: ProviderProps) => {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') return ''; // browser should use relative url
    return httpRpcURL || `https://labai.tecmie.africa`; // dev SSR should use localhost
  };

  const secretOrKey = secret ?? process.env.INFERENCE_SECRET;
  if (!secretOrKey) {
    throw new Error('secret is required');
  }

  const [queryClient] = useState(() => defaultQueryClient ?? new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
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
            'x-secret': secretOrKey,
          }),
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
