import { Context } from '@/router/types';

const forbiddenRoutes = ['register'];

export default async function register({
  next,
  to,
  store,
}: Context) {
  const isForbidden = forbiddenRoutes.find((item: string) => item === to.name);

  await store.dispatch('settings/getIsRegistrationEnabled');

  if (store.getters['auth/isAuth']) {
    return next({ name: 'dashboard' });
  }

  if (!store.state.settings.enabledRegistrationNoAuth && isForbidden) {
    return next({
      name: 'login',
    });
  }
  return next();
}
