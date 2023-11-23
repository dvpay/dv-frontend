import { createStore } from 'vuex';
import { app } from '@/store/app';
import { auth } from '@/store/auth';
import { stores } from '@/store/stores';
import { dictionaries } from '@/store/dictionaries';
import { wallets } from '@/store/wallets';
import { invoices } from '@/store/invoices';
import { dashboard } from '@/store/dashboard';
import { currency } from '@/store/currency';
import { balances } from '@/store/balances';
import { transactions } from '@/store/transactions';
import { monitoring } from '@/store/monitoring';
import { user } from '@/store/user';
import { addresses } from '@/store/addresses';
import { notifications } from '@/store/notifications';
import { exchanges } from '@/store/exchanges';
import { rates } from '@/store/rates';
import { users } from '@/store/users';
import { invite } from '@/store/invite';
import { invoice } from '@/store/invoice';
import { payer } from '@/store/payer';
import { withdrawals } from '@/store/withdrawals';
import { withdrawal_wallet } from '@/store/withdrawal_wallet';
import { settings } from '@/store/settings';
import _cloneDeep from 'lodash/cloneDeep';
import _forOwn from 'lodash/forOwn';
import { processing_wallet } from '@/store/processing_wallet';

const storeModules = {
  app,
  auth,
  stores,
  dictionaries,
  wallets,
  invoices,
  dashboard,
  currency,
  balances,
  transactions,
  monitoring,
  user,
  addresses,
  notifications,
  exchanges,
  rates,
  users,
  invite,
  invoice,
  payer,
  withdrawals,
  withdrawal_wallet,
  settings,
  processing_wallet,
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
          Object.keys(state[excludedStates])
            .forEach((item) => {
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
