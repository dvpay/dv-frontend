import { Context } from '@/router/types';

const allowedRoutes = ['invoice', 'verify-email', 'new-invoice'];
const forbiddenRoutes = ['home'];

export default function auth({ next, to, store }: Context) {
  const isAllowed = allowedRoutes.find((item: string) => item === to.name);
  const isForbidden = forbiddenRoutes.find((item: string) => item === to.name);
  if (!store.getters['auth/isAuth'] && !isAllowed) {
    return next({
      name: 'login',
    });
  }

  if (isForbidden && store.getters['auth/isAuth']) {
    return next({
      name: 'dashboard',
    });
  }

  return next();
}
