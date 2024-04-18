import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import ExchangesService from '@/services/ExchangesService';
import {
  ExchangeDirectionsResponse,
  ExchangeWithdrawalHistoryResponse,
  UserExchangeDirectionsResponse,
  UserExchangesRequest,
  UserExchangesResponse,
  WalletsResponse,
} from '@/services/ExchangesService/types';
import { PaginationResponse } from '@/api/types';
import { formatDate, numberFormatter } from '@/utils';

const toast = useToast();

interface ExchangesState {
  listOfExchanges: UserExchangesResponse[];
  isListOfExchangesLoaded: boolean;
  depositWallets: WalletsResponse[];
  withdrawalWallets: WalletsResponse[];
  walletsLoading: boolean;
  isWalletsLoaded: boolean;
  allExchangeDirections: ExchangeDirectionsResponse;
  allExchangeDirectionsSymbols: [];
  userExchangeDirections: UserExchangeDirectionsResponse[];
  coldWallets: [];
  exchangeWithdrawalHistory: ExchangeWithdrawalHistoryResponse[];
  pagination: Partial<PaginationResponse>;
}

const state: ExchangesState = {
  listOfExchanges: [],
  isListOfExchangesLoaded: false,
  depositWallets: [],
  withdrawalWallets: [],
  walletsLoading: false,
  isWalletsLoaded: false,
  allExchangeDirections: {},
  allExchangeDirectionsSymbols: [],
  userExchangeDirections: [],
  coldWallets: [],
  exchangeWithdrawalHistory: [],
  pagination: {},
};

const getters: GetterTree<ExchangesState, RootState> = {
  isWalletsExist(state) {
    return !!state.depositWallets.length && !!state.withdrawalWallets.length;
  },
  getExchangeWithdrawalHistory(state, rooGetters, rootState) {
    return state.exchangeWithdrawalHistory.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
    }));
  },
};

const mutations: MutationTree<ExchangesState> = {
  setListOfExchanges(state, value: UserExchangesResponse[]) {
    state.listOfExchanges = value;
  },

  setIsListOfExchangesLoaded(state, value: boolean) {
    state.isListOfExchangesLoaded = value;
  },

  setDepositWallets(state, value: WalletsResponse[]) {
    state.depositWallets = [...value]
      .map((item) => ({
        currency: item.currency,
        chain: item.chain,
        address: item.address,
      }));
  },

  setWithdrawalWallets(state, value: WalletsResponse[]) {
    state.withdrawalWallets = [...value]
      .map((item) => ({
        currency: item.currency,
        chain: item.chain,
        address: item.address,
        title: `${item.address} (${item.chain})`,
        value: item.address,
      }));
  },

  setWalletsLoading(state, value: boolean) {
    state.walletsLoading = value;
  },

  setIsWalletsLoaded(state, value: boolean) {
    state.isWalletsLoaded = value;
  },

  setAllExchangeDirections(state, value: ExchangeDirectionsResponse) {
    state.allExchangeDirections = value;
  },

  setAllExchangeDirectionsSymbols(state, value: []) {
    state.allExchangeDirectionsSymbols = value;
  },
  setUserExchangeDirections(state, value: UserExchangeDirectionsResponse[]) {
    state.userExchangeDirections = value;
  },
  setColdWallets(state, value: []) {
    state.coldWallets = value;
  },
  setPagination(state, value: PaginationResponse) {
    state.pagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },

  setExchangeWithdrawalHistory(state, value: ExchangeWithdrawalHistoryResponse[]) {
    state.exchangeWithdrawalHistory = [...value]
      .map((item) => {
        return {
          ...item,
          amount: item.amount
            ? numberFormatter(item.amount)
            : item.amount,
        };
      });
  },
};

const actions: ActionTree<ExchangesState, RootState> = {
  async connect(context, payload: UserExchangesRequest) {
    try {
      await ExchangesService.updateExchangeKeys(
        payload,
        context.rootGetters['auth/accessToken'],
      );

      const testConnection = await ExchangesService.testExchange(
        { exchange: payload.exchange.toLowerCase() },
        context.rootGetters['auth/accessToken'],
      );

      if (testConnection.status === 200) {
        await Promise.all([
          context.dispatch('loadDepositWallets', { exchange: payload.exchange.toLowerCase() }),
          context.dispatch('loadWithdrawalWallets', { exchange: payload.exchange.toLowerCase() }),
        ]);
      }
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadListOfExchanges(context) {
    try {
      const { data } = await ExchangesService.getUserExchanges(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setListOfExchanges', result);
      context.commit('setIsListOfExchangesLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateExchangeKeys(context, payload) {
    try {
      await ExchangesService.updateExchangeKeys(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async testExchange(context, payload) {
    try {
      await ExchangesService.testExchange(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadWallets(context, params) {
    try {
      const testConnection = await ExchangesService.testExchange(
        { exchange: params.exchange.toLowerCase() },
        context.rootGetters['auth/accessToken'],
      );
      if (testConnection.status === 200) {
        context.commit('setWalletsLoading', true);
        await Promise.all([
          context.dispatch('loadDepositWallets', params),
          context.dispatch('loadWithdrawalWallets', params),
        ]);
      }
      context.commit('setWalletsLoading', false);
      context.commit('setIsWalletsLoaded', true);
    } catch (e) {
      context.commit('setWalletsLoading', false);
      toast.error(e.message);
      throw e;
    }
  },

  async loadDepositWallets(context, params) {
    const { data } = await ExchangesService.getDepositWallets(
      params,
      context.rootGetters['auth/accessToken'],
    );
    const { result } = data;
    context.commit('setDepositWallets', result);
  },

  async loadWithdrawalWallets(context, params) {
    const { data } = await ExchangesService.getWithdrawalWallets(
      params,
      context.rootGetters['auth/accessToken'],
    );
    const { result } = data;
    context.commit('setWithdrawalWallets', result);
  },

  async loadAllExchangeDirections(context, params) {
    try {
      const { data } = await ExchangesService.getAllExchangeDirections(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setAllExchangeDirections', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadAllExchangeDirectionsSearch(context, params) {
    try {
      const { data } = await ExchangesService.getAllExchangeDirectionsSearch(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setAllExchangeDirectionsSymbols', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadUserExchangeDirections(context, params) {
    try {
      const { data } = await ExchangesService.getUserExchangeDirections(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setUserExchangeDirections', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateUserExchangeDirections(context, payload) {
    try {
      await ExchangesService.updateUserExchangeDirections(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async batchUpdateUserExchangeDirections(context, payload) {
    try {
      await ExchangesService.batchUpdateUserExchangeDirections(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateExchangeSettings(context, {
    walletId,
    payload,
  }) {
    try {
      await ExchangesService.updateExchangeSettings(
        walletId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadColdWallet(context, params) {
    try {
      const { data: { result } } = await ExchangesService.getColdWallets(
        params,
        context.rootGetters['auth/accessToken'],
      );
      context.commit('setColdWallets', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async storeColdWallet(context, payload) {
    try {
      await ExchangesService.createColdWallets(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async deleteColdwallet(context, {
    walletId,
    payload,
  }) {
    try {
      await ExchangesService.deleteColdWallets(
        walletId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async toggleStatus(context, payload) {
    try {
      await ExchangesService.changeStatus(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async changeStatusExchange(context, payload) {
    try {
      await ExchangesService.updateStatusExchange(
        payload,
        context.rootGetters['auth/accessToken'],
      );
      await context.dispatch('user/loadUserInfo', null, { root: true });
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadExchangeColdWalletHistory(context, params) {
    try {
      const { data } = await ExchangesService.getWithdrawalFromExchange(params, context.rootGetters['auth/accessToken']);
      console.log(data);
      const {
        result,
        meta,
      } = data;
      context.commit('setPagination', meta);
      context.commit('setExchangeWithdrawalHistory', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const exchanges: Module<ExchangesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
