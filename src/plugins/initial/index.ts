import { Plugin } from 'vue';
import store from '@/store';
import router from '@/router';

const initial: Plugin = async () => {
  await router.isReady();

  if (store.getters['auth/isAuth']) {
    if (!store.state.user.isUserInfoLoading) {
      await store.dispatch('user/loadUserInfo');
    }

    if (!store.state.stores.isStoreListLoading) {
      await store.dispatch('stores/loadStores');
    }
  }
  if (
    !store.state.dictionaries.isDictionariesLoading
    && store.getters['auth/isAuth']
  ) {
    await store.dispatch('dictionaries/loadDictionaries');
  }
};

export default initial;
