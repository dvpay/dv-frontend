import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import DashboardService from '@/services/DashboardService';
import {
  SystemStatusResponse,
  DepositSummaryResponse,
  LastDepositTransactionsResponse,
  SavedAndExchangedResponse,
  SavedExchangedRange,
} from '@/services/DashboardService/types';
import { formatDate, decimal, formatDateSummary, shortName, isJson, day, numberFormatter } from '@/utils';

const toast = useToast();

interface DashboardState {
  systemStatus: SystemStatusResponse[];
  isSystemStatusLoaded: boolean;
  depositSummary: DepositSummaryResponse[];
  isDepositSummaryLoaded: boolean;
  lastDepositTransactions: LastDepositTransactionsResponse[];
  isLastDepositTransactionsLoaded: boolean;
  savedAndExchanged: Array<SavedExchangedRange & { actions: string }>
  isSavedAndExchangedLoaded: boolean;
}

const state: DashboardState = {
  systemStatus: [],
  isSystemStatusLoaded: false,
  depositSummary: [],
  isDepositSummaryLoaded: false,
  lastDepositTransactions: [],
  isLastDepositTransactionsLoaded: false,
  savedAndExchanged: [],
  isSavedAndExchangedLoaded: false,
};

const getters: GetterTree<DashboardState, RootState> = {
  getDepositSummary(state, rooGetters, rootState) {
    return state.depositSummary
      .map((item) => ({
        ...item,
        date: formatDateSummary({
          date: item.date,
          locale: rootState.app.locale,
          range: state.depositSummary.length > 8 ? 'month' : 'day',
        }),
      }));
  },

  getLastDepositTransactions(state, rooGetters, rootState) {
    return state.lastDepositTransactions
      .map((item) => ({
        ...item,
        date: formatDate(item.date, rootState.app.dateFormat, '', true),
      }));
  },

  getSystemStatus(state, rooGetters, rootState) {
    return state.systemStatus.map((item: SystemStatusResponse) => ({
      ...item,
      ago: day(item.lastTrigger, rootState.app.locale),
    }));
  },
};

const mutations: MutationTree<DashboardState> = {
  setSystemStatus(state, value) {
    state.systemStatus = value;
  },

  setIsSystemStatusLoaded(state, value) {
    state.isSystemStatusLoaded = value;
  },

  setDepositSummary(state, value: DepositSummaryResponse[]) {
    state.depositSummary = [...value]
      .map((item) => ({
        ...item,
        sum: numberFormatter(item.sum),
      }))
      .sort(DashboardService.dateSort);
  },

  setIsDepositSummaryLoaded(state, value) {
    state.isDepositSummaryLoaded = value;
  },

  setLastDepositTransactions(state, value: LastDepositTransactionsResponse[]) {
    state.lastDepositTransactions = [...value]
      .map((item) => ({
        ...item,
        amountUsd: numberFormatter(item.amountUsd),
        amount: item.currencyId === 'USDT.Tron'
          ? numberFormatter(item.amount)
          : decimal(item.amount),
        storeName: shortName(item.storeName),
        custom: isJson(item.custom)
          ? JSON.parse(item.custom || '[]')
          : item.custom,
      }));
  },

  setIsLastDepositTransactionsLoaded(state, value) {
    state.isLastDepositTransactionsLoaded = value;
  },

  setSavedAndExchanged(state, value: SavedAndExchangedResponse) {
    state.savedAndExchanged = Object.entries(value)
      .map((item) => ({
        ...item[1] as SavedExchangedRange,
        actions: item[0],
        today: { amountUsd: numberFormatter(item[1].today.amountUsd) },
        yesterday: { amountUsd: numberFormatter(item[1].yesterday.amountUsd) },
        month: { amountUsd: numberFormatter(item[1].month.amountUsd) },
      }));
  },

  setIsSavedAndExchangedLoaded(state, value: boolean) {
    state.isSavedAndExchangedLoaded = value;
  },
};

const actions: ActionTree<DashboardState, RootState> = {
  async loadSystemStatus(context) {
    try {
      const { data } = await DashboardService.getSystemStatus(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setSystemStatus', result);
      context.commit('setIsSystemStatusLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadDepositSummary(context, params) {
    try {
      const stores = await context.dispatch('stores/getStoresForRequest', null, { root: true });
      const { data } = await DashboardService.getDepositSummary(
        {
          ...params,
          ...stores,
        },
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setDepositSummary', result);
      context.commit('setIsDepositSummaryLoaded', true);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },

  async loadLastDepositTransactions(context, params) {
    try {
      const stores = await context.dispatch('stores/getStoresForRequest', null, { root: true });
      const { data } = await DashboardService.getLastDepositTransactions(
        {
          ...params,
          ...stores,
        },
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setLastDepositTransactions', result);
      context.commit('setIsLastDepositTransactionsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadSavedAndExchanged(context) {
    try {
      const { data } = await DashboardService.getSavedAndExchanged(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setSavedAndExchanged', result);
      context.commit('setIsSavedAndExchangedLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async stopOrStartAllStores(context, status) {
    try {
      await DashboardService.stopOrStartAllStores(
        { status },
        context.rootGetters['auth/accessToken'],
      );
      await context.dispatch('user/loadUserInfo', null, { root: true });
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async stopOrStartAllTransfers(context, status) {
    try {
      await DashboardService.stopOrStartAllTransfers(
        { status },
        context.rootGetters['auth/accessToken'],
      );
      await context.dispatch('user/loadUserInfo', null, { root: true });
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const dashboard: Module<DashboardState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
