import { Context } from '@/router/types';

export default function guest({ next, store }: Context) {
  if (store.getters['auth/isAuth']) {
    return next({ name: 'dashboard' });
  }
  return next();
}
