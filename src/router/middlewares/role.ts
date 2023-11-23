import { Context } from '@/router/types';

const supportRoutes = ['support-search-tx'];
const rootRoutes = ['all-users', 'all-users-user', 'root-settings'];

export default async function role({ next, to, store }: Context) {
  const isSupportRoutes = supportRoutes.find((item: string) => item === to.name);
  const isRootRoutes = rootRoutes.find((item: string) => item === to.name);

  if (store.getters['auth/isAuth']) {
    try {
      if (!store.state.user.isUserInfoLoaded) {
        store.commit('user/setIsUserInfoLoading', true);
        await store.dispatch('user/loadUserInfo');
      }
      if (store.getters['user/userRole'] === 'support') {
        if (isSupportRoutes) {
          return next();
        }
        return next({ name: 'support-search-tx' });
      }
      if (store.getters['user/userRole'] !== 'root') {
        if (isRootRoutes) {
          return next({ name: 'dashboard' });
        }
        return next();
      }
      return next();
    } catch (e) {
      return next();
    }
  }
  return next({ name: 'login' });
}
