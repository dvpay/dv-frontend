import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router/routes';
import store from '@/store';
import middlewarePipeline from '@/router/middlewarePipeline';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next();
  }
  const middleware = to.meta.middleware;

  const context = {
    to,
    from,
    next,
    store,
  };

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

router.beforeResolve(async (to, from, next) => {
  if (to.meta.progressBar) {
    store.commit('app/setProgressBar', 'start');
  }

  next();
});

export default router;
