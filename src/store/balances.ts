import { Module, MutationTree, ActionTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import BalancesService from '@/services/BalancesService';
import { Balances, Totals } from '@/services/BalancesService/types';
import { decimal, numberFormatter } from '@/utils';

const toast = useToast();

interface BalancesState {
  balances: Balances[];
  totals: Partial<Totals>;
  isBalancesLoaded: boolean;
}

const state: BalancesState = {
  balances: [],
  totals: {},
  isBalancesLoaded: false,
};

const mutations: MutationTree<BalancesState> = {
  setBalances(state, value: Balances[]) {
    state.balances = [...value].map((item) => {
      return {
        ...item,
        balance: item.currency === 'USDT.Tron'
          ? numberFormatter(item.balance)
          : decimal(item.balance),
        balanceUsd: numberFormatter(item.balanceUsd),
      };
    });
  },

  setTotals(state, value: Totals) {
    state.totals = {
      ...value,
      amountUsd: numberFormatter(value.amountUsd),
    };
  },

  setIsBalancesLoaded(state, value: boolean) {
    state.isBalancesLoaded = value;
  },
};

const actions: ActionTree<BalancesState, RootState> = {
  async loadBalances(context) {
    try {
      const stores = await context.dispatch('stores/getStoresForRequest', null, { root: true });
      const { data } = await BalancesService.getAllBalances(
        {
          ...stores,
        },
        context.rootGetters['auth/accessToken'],
      );

      const { result } = data;
      context.commit('setBalances', result.balances);
      context.commit('setTotals', result.totals);
      context.commit('setIsBalancesLoaded', true);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },
};

export const balances: Module<BalancesState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
