import * as React from 'react';
import { createContext, useContext } from 'react';
import { LabQueryRequest, LabQueryResponse } from '../types';
import { createLabProxy } from './proxy';

/**
 * Context for providing the Lab Proxy throughout your application.
 * This context is used by various hooks to access the Lab Proxy.
 *
 * @see {@link LabProvider} for how to provide this context.
 */
export const LabBaseContext = createContext(
  createLabProxy({ secretOrKey: '' })
);

/**
 * Props for the `LabProvider` component.
 *
 * @typedef {Object} LabProviderProps
 * @property {React.ReactNode} children - The child components to be rendered within this provider.
 * @property {string} [customHttpLink] - Optional custom HTTP link for the Lab Proxy.
 * @property {string} secretOrKey - Secret or key for the Lab Proxy.
 */
export type LabProviderProps = {
  children: React.ReactNode;
  customHttpLink?: string;
  secretOrKey: string;
};

/**
 * `LabProvider` component.
 *
 * This component creates a Lab Proxy and provides it to the rest of your application.
 * Any components that need to use the Lab Proxy should be rendered within a `LabProvider`.
 *
 * @example
 * <LabProvider secretOrKey="my-secret-or-key">
 *   <MyComponent />
 * </LabProvider>
 *
 * @param {LabProviderProps} props - The props to configure the provider.
 */
export const LabProvider = ({
  secretOrKey,
  customHttpLink,
  children,
}: LabProviderProps) => {
  const proxy = createLabProxy({ secretOrKey, customHttpLink });

  return (
    <LabBaseContext.Provider value={proxy}>{children}</LabBaseContext.Provider>
  );
};

/**
 * Hook to perform a Lab Inference Query.
 *
 * This hook returns a `query` function that can be used to perform a Lab Inference Query.
 * The `query` function takes a `LabQueryRequest` object as a parameter. This object must have a `documents` property which is an array of strings.
 *
 * The response is an array of `LabQueryResponse` objects.
 *
 * It must be used within a `LabProvider`. If it's used outside of a `LabProvider`, it will throw an error.
 *
 * @example
 * const { query } = useLabInference();
 * const response = await query({ documents: ['document1', 'document2'] });
 * // response is an array of `LabQueryResponse` objects
 *
 * @return {Object} Returns an object with a `query` function.
 *
 * @throws Will throw an error if not used within a `LabProvider`.
 */
export const useLabInference = () => {
  const context = useContext(LabBaseContext);

  if (!context) {
    throw new Error('useScanner must be used within a LabProvider');
  }

  const query = async ({
    documents,
  }: LabQueryRequest): Promise<LabQueryResponse[]> => {
    // @ts-ignore
    const response = (await context.scanner.read.mutate({
      json: {
        diagnosis: documents,
      },
    })) as LabQueryResponse[];
    return response;
  };

  return {
    query,
  };
};
