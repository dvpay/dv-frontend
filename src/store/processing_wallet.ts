import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/types';
import {
  ProcessingWalletInfoResponse, ProcessingWalletStatsResponse,
  ProcessingWalletTransferResponse
} from '@/services/ProcessingWalletService/types';
import ProcessingWalletService from '@/services/ProcessingWalletService';
import { useToast } from 'vue-toastification';
import { formatDateSummary } from '@/utils';

const toast = useToast();

interface ProcessingWalletState {
  stats: ProcessingWalletInfoResponse[],
  processingWalletTransfers: ProcessingWalletTransferResponse[],
  processingStats: ProcessingWalletStatsResponse
}

const state: ProcessingWalletState = {
  stats: [],
  processingWalletTransfers: [],
  processingStats: {
    transferCount: 0,
    avgBandwidth: 0,
    avgEnergy: 0,
  },
};

const getters: GetterTree<ProcessingWalletState, RootState> = {
  getProcessingWalletState(state, rootGetters, rootState) {
    return state.stats.map((item) => ({
      ...item,
      dateHumanFormat: formatDateSummary({
        date: item.date,
        locale: rootState.app.locale,
        range: state.stats.length > 8 ? 'month' : 'day',
      }),
    }));
  },
};

const mutations: MutationTree<ProcessingWalletState> = {
  setProcessingWalletStat(state, value) {
    state.stats = value;
  },
  setProcessingWalletTransfers(state, value) {
    state.processingWalletTransfers = value;
  },
  setProcessingWalletStats(state, value) {
    state.processingStats = value;
  },
};

const actions: ActionTree<ProcessingWalletState, RootState> = {
  async loadProcessingWalletStat(context, blockchain) {
    try {
      const { data } = await ProcessingWalletService.getProcessingWalletInfo(
        blockchain,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setProcessingWalletStat', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
  async loadProcessingWalletTransfersStats(context, request) {
    try {
      const { data } = await ProcessingWalletService.getProcessingWalletTransfer(
        request.currencyId,
        request.date,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setProcessingWalletTransfers', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
  async loadProcessingWalletTransferStatistics(context, blockchain) {
    try {
      const { data } = await ProcessingWalletService.getProcessingWalletTransferStats(
        blockchain,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setProcessingWalletStats', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
  async updateTransferType(context, payload) {
    try {
      const { data } = await ProcessingWalletService.updateProcessingTransferType(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};
export const processing_wallet: Module<ProcessingWalletState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
