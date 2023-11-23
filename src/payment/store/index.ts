import { createStore } from 'vuex';
import { app } from '@/store/app';
import { invoice } from '@/store/invoice';
import { payer } from '@/store/payer';
import _cloneDeep from 'lodash/cloneDeep';
import _forOwn from 'lodash/forOwn';

const storeModules = {
  app,
  invoice,
  payer,
};

const initialStoreModules = _cloneDeep(storeModules);

interface Excluded {
  modules?: string[];
  states?: Partial<typeof storeModules>;
}

export default createStore({
  modules: storeModules,

  mutations: {
    resetStore(state) {
      _forOwn(initialStoreModules, (value, key) => {
        Object.assign(state[key], _cloneDeep(value.state));
      });
    },

    resetStoreExclude(state, excluded: Excluded) {
      _forOwn(initialStoreModules, (value, key) => {
        const excludedStates = Object.keys(excluded?.states || {})
          .find((elem) => elem === key);

        const excludedModules = excluded?.modules?.find((elem) => elem === key);

        if (excludedStates) {
          Object.keys(state[excludedStates]).forEach((item) => {
            const exc = Object.values(excluded?.states || {})
              .map((elem) => (elem as Array<string>).find((unit) => unit === item))
              .filter((n) => n);

            if (exc[0]) {
              state[excludedStates][item] = _cloneDeep(state[excludedStates][item]);
            } else {
              state[excludedStates][item] = _cloneDeep(value.state?.[item as keyof typeof value.state]);
            }
          });
        } else if (!excludedModules) {
          Object.assign(state[key], _cloneDeep(value.state));
        }
      });
    },
  },
});
