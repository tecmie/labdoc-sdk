import { createTRPCReact } from '@trpc/react-query';
import {
  type inferRouterInputs,
  type inferRouterOutputs,
  AnyRouter,
} from '@trpc/server';

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
