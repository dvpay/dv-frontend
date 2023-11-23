import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import { PaginationResponse } from '@/api/types';
import WalletsService from '@/services/WalletsService';
import {
  WalletsResponse,
  WithdrawalsSettingsResponse,
  WithdrawalsTransactionsResponse,
  ProcessingWalletsResponse,
  WithdrawalsStatsResponse,
  WithdrawalsDatesResponse,
} from '@/services/WalletsService/types';
import { decimal, formatDate, capitalizeFirstLetter, gte, numberFormatter } from '@/utils';

const toast = useToast();

interface WalletsState {
  wallets: WalletsResponse[];
  isWalletsLoaded: boolean;
  readonly: boolean;
  mnemonic: string;
  passPhrase: string;
  confirmPassPhrase: string;
  withdrawalsSettings: Partial<WithdrawalsSettingsResponse>;
  withdrawalsTransactions: WithdrawalsTransactionsResponse[];
  isWithdrawalsTransactionsLoaded: boolean;
  withdrawalsTransactionsPagination: Partial<PaginationResponse>;
  processingWallets: ProcessingWalletsResponse[];
  isProcessingWalletsLoaded: boolean;
  withdrawalsStats: WithdrawalsStatsResponse;
  isWithdrawalsStatsLoaded: boolean;
  withdrawalsDates: WithdrawalsDatesResponse[];
  isWithdrawalsDatesLoaded: boolean;
  withdrawalsDatesPagination: Partial<PaginationResponse>;
}

const state: WalletsState = {
  wallets: [],
  isWalletsLoaded: false,
  readonly: false,
  mnemonic: '',
  passPhrase: '',
  confirmPassPhrase: '',
  withdrawalsSettings: {},
  withdrawalsTransactions: [],
  isWithdrawalsTransactionsLoaded: false,
  withdrawalsTransactionsPagination: {},
  processingWallets: [],
  isProcessingWalletsLoaded: false,
  withdrawalsStats: {
    today: { amountUsd: 0 },
    yesterday: { amountUsd: 0 },
    currentMonth: { amountUsd: 0 },
    previousMonth: { amountUsd: 0 },
  },
  isWithdrawalsStatsLoaded: false,
  withdrawalsDates: [],
  isWithdrawalsDatesLoaded: false,
  withdrawalsDatesPagination: {},
};

const getters: GetterTree<WalletsState, RootState> = {
  isReadonly(state) {
    if (state.readonly) {
      return state.readonly;
    }
    return localStorage.getItem('readonly') === 'true';
  },

  getWithdrawalsTransactions(state, rooGetters, rootState) {
    return state.withdrawalsTransactions.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
    }));
  },

  getWithdrawalsDates(state, rooGetters, rootState) {
    return state.withdrawalsDates.map((item) => ({
      ...item,
      date: formatDate(
        item.date,
        rootState.app.dateFormat,
        rootState.user.selectedLocation,
      ).split(' ')[0],
      dateParam: item.date,
    }));
  },
};

const mutations: MutationTree<WalletsState> = {
  setWallets(state, value: WalletsResponse[]) {
    state.wallets = [...value].map((item) => ({
      ...item,
      exchangeColdWalletAddresses: item.exchangeColdWalletAddresses?.length
        ? item.exchangeColdWalletAddresses.map((el) => ({
          address: el.address,
          isWithdrawalEnabled: el.isWithdrawalEnabled,
          chain: el.chain,
          withdrawalMinBalance: el.withdrawalMinBalance ? decimal(el.withdrawalMinBalance) : 0,
        })) : item.exchangeColdWalletAddresses,
    }));
  },

  setIsWalletsLoaded(state, value: boolean) {
    state.isWalletsLoaded = value;
  },

  setWithdrawalsSettings(state, value: WithdrawalsSettingsResponse) {
    state.withdrawalsSettings = {
      ...value,
      minBalance: decimal(value.minBalance),
      blockchain: capitalizeFirstLetter(value.blockchain),
      exchangeColdWalletAddresses: value.exchangeColdWalletAddresses?.length
        ? value.exchangeColdWalletAddresses.map((item) => ({
          ...item,
          withdrawalMinBalance: item.withdrawalMinBalance
            ? decimal(item.withdrawalMinBalance)
            : item.withdrawalMinBalance,
        }))
        : value.exchangeColdWalletAddresses,
    };
  },

  setWithdrawalsTransactions(state, value: WithdrawalsTransactionsResponse[]) {
    state.withdrawalsTransactions = [...value]
      .map((item) => {
        return {
          ...item,
          amount: item.currency === 'USDT.Tron'
            ? numberFormatter(item.amount)
            : decimal(item.amount),
        };
      });
  },

  setIsWithdrawalsTransactionsLoaded(state, value: boolean) {
    state.isWithdrawalsTransactionsLoaded = value;
  },

  setWithdrawalsTransactionsPagination(state, value: PaginationResponse) {
    state.withdrawalsTransactionsPagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },

  clearWithdrawalsSettings(state) {
    state.withdrawalsSettings = {};
  },

  setProcessingWallets(state, value: ProcessingWalletsResponse[]) {
    state.processingWallets = [...value]
      .map((item) => {
        return {
          ...item,
          balance: numberFormatter(item.balance),
          minBalance: numberFormatter(item.minBalance),
          isEnoughBalance: gte(item.balance, item.minBalance),
          bandwidth: numberFormatter(item.bandwidth),
          bandwidthLimit: numberFormatter(item.bandwidthLimit),
          energy: numberFormatter(item.energy),
          energyLimit: numberFormatter(item.energyLimit),
        };
      });
  },

  setIsProcessingWalletsLoaded(state, value: boolean) {
    state.isProcessingWalletsLoaded = value;
  },

  setReadOnly(state, value: boolean) {
    state.readonly = value;
    localStorage.setItem('readonly', value.toString());
  },

  setMnemonic(state, value: string) {
    state.mnemonic = value;
  },

  setPassPhrase(state, value: string) {
    state.passPhrase = value;
  },

  setConfirmPassPhrase(state, value: string) {
    state.confirmPassPhrase = value;
  },

  setWithdrawalsStats(state, value: WithdrawalsStatsResponse) {
    state.withdrawalsStats = Object.entries(value).reduce((acc, curr) => {
      acc[curr[0] as keyof WithdrawalsStatsResponse] = { amountUsd: numberFormatter(curr[1].amountUsd) };
      return acc;
    }, {} as WithdrawalsStatsResponse);
  },

  setIsWithdrawalsStatsLoaded(state, value: boolean) {
    state.isWithdrawalsStatsLoaded = value;
  },

  setWithdrawalsDates(state, value: WithdrawalsDatesResponse[]) {
    state.withdrawalsDates = [...value].map((item) => ({
      ...item,
      amountUsd: numberFormatter(item.amountUsd),
    }));
  },

  setIsWithdrawalsDatesLoaded(state, value: boolean) {
    state.isWithdrawalsDatesLoaded = value;
  },

  setWithdrawalsDatesPagination(state, value: PaginationResponse) {
    state.withdrawalsDatesPagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },
};

const actions: ActionTree<WalletsState, RootState> = {
  async loadWallets(context) {
    try {
      const { data } = await WalletsService.getWallets(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setWallets', result);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },

  async createWallets(context) {
    try {
      await WalletsService.createWallets(
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },

  async loadAndCreateWallets(context) {
    try {
      await context.dispatch('loadWallets');
      if (!context.state.wallets.length) {
        await context.dispatch('createWallets');
        await context.dispatch('loadWallets');
      }
      context.commit('setIsWalletsLoaded', true);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async loadWithdrawalsSettings(context, walletId) {
    try {
      if (!Object.keys(context.rootState.dictionaries.dictionaries).length) {
        context.commit('dictionaries/setIsDictionariesLoading', true, { root: true });
        await context.dispatch('dictionaries/loadDictionaries', null, { root: true });
      }

      const { data } = await WalletsService.getWithdrawalsSettings(
        walletId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setWithdrawalsSettings', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateWithdrawalsSettings(context, { walletId, payload }) {
    try {
      await WalletsService.updateWithdrawalsSettings(
        walletId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadWithdrawalsTransactions(context, params) {
    try {
      const { data } = await WalletsService.getWithdrawalsTransactions(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result, meta } = data;
      context.commit('setWithdrawalsTransactions', result);
      context.commit('setWithdrawalsTransactionsPagination', meta);
      context.commit('setIsWithdrawalsTransactionsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async withdrawalsRequest(context, payload) {    
    try {
      await WalletsService.withdrawalsRequest(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadProcessingWallets(context) {
    try {
      const { data } = await WalletsService.getProcessingWallets(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setProcessingWallets', result);
      context.commit('setIsProcessingWalletsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async generateMnemonic(context) {
    try {
      const { data } = await WalletsService.generateMnemonic();
      const { result } = data;
      context.commit('setMnemonic', result[0]);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadWithdrawalsStats(context, params) {
    try {
      const { data } = await WalletsService.getWithdrawalsStats(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setWithdrawalsStats', result);
      context.commit('setIsWithdrawalsStatsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadWithdrawalsDates(context, params) {
    try {
      const { data } = await WalletsService.getWithdrawalsDates(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result, meta } = data;
      context.commit('setWithdrawalsDates', result);
      context.commit('setWithdrawalsDatesPagination', meta);
      context.commit('setIsWithdrawalsDatesLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const wallets: Module<WalletsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
