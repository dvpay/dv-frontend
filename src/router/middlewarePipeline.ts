import { Context, Middleware } from '@/router/types';

function middlewarePipeline(context: Context, middlewares: Middleware[], index: number) {
  const nextMiddleware = middlewares[index];

  if (!nextMiddleware) {
    return context.next;
  }

  return () => {
    const nextPipeline = middlewarePipeline(context, middlewares, index + 1);
    nextMiddleware({ ...context, next: nextPipeline });
  };
}

export default middlewarePipeline;
