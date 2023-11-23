import { ActionTree, Module, MutationTree } from 'vuex';
import { WithdrawalWallerResponse } from '@/services/WithdrawalWalletService/types';
import { RootState } from '@/store/types';
import { useToast } from 'vue-toastification';
import WithdrawalWalletService from '@/services/WithdrawalWalletService';
import ExchangesService from '@/services/ExchangesService';
import { WalletsResponse } from '@/services/WalletsService/types';

const toast = useToast();

interface WithdrawalWalletState {
  withdrawalWallets: WithdrawalWallerResponse[];
  withdrawalWallet: Partial<WithdrawalWallerResponse>;
  isWithdrawalWalletsLoaded: boolean;
  depositWallets: WalletsResponse[];
  exchangeConnect: boolean;

}

const state: WithdrawalWalletState = {
  withdrawalWallets: [],
  withdrawalWallet: {},
  isWithdrawalWalletsLoaded: false,
  depositWallets: [],
  exchangeConnect: false,
};

const mutations: MutationTree<WithdrawalWalletState> = {
  setWithdrawalWallets(state, value) {
    state.withdrawalWallets = value;
  },

  setWithdrawalWallet(state, value) {
    state.withdrawalWallet = value;
  },

  setWithdrawalWalletsLoaded(state, value: boolean) {
    state.isWithdrawalWalletsLoaded = value;
  },

  setExchangeConnect(state, value: boolean) {
    state.exchangeConnect = value;
  },

  setDepositWallets(state, value) {
    state.depositWallets = value;
  },
};

const actions: ActionTree<WithdrawalWalletState, RootState> = {
  async loadWithdrawalWallets(ctx) {
    ctx.commit('setWithdrawalWalletsLoaded', false);
    try {
      const { data: { result } } = await WithdrawalWalletService.getWithdrawalWallets(
        ctx.rootGetters['auth/accessToken'],
      );
      ctx.commit('setWithdrawalWallets', result);
      ctx.commit('setWithdrawalWalletsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadWithdrawalWallet(ctx, wallet) {
    ctx.commit('setWithdrawalWalletsLoaded', false);
    try {
      const { data: { result } } = await WithdrawalWalletService.getWithdrawalWallet(
        wallet,
        ctx.rootGetters['auth/accessToken'],
      );
      ctx.commit('setWithdrawalWallet', result);
      ctx.commit('setWithdrawalWalletsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async testExchange(ctx, payload) {
    try {
      await ExchangesService.testExchange(
        payload,
        ctx.rootGetters['auth/accessToken'],
      );
      ctx.commit('setExchangeConnect', true);
    } catch {

    }
  },

  async loadDepositWallets(ctx, params) {
    const { data: { result } } = await ExchangesService.getDepositWallets(
      params,
      ctx.rootGetters['auth/accessToken'],
    );
    ctx.commit('setDepositWallets', result);
  },

  async updateWithdrawalWalletHandeler(ctx, payload) {
    try {
      await WithdrawalWalletService.updateWithdrawalWallet(payload.id, payload, ctx.rootGetters['auth/accessToken']);
    } catch (e) {
      toast.error(e.message);
    }
  },

  async requestWithdrawal(ctx, payload) {
    try {
      await WithdrawalWalletService.createWithdrawal(payload, ctx.rootGetters['auth/accessToken']);
    } catch (e) {
      toast.error(e.message);
    }
  },

  async requestWithdrawalFromAddress(ctx, payload) {
    try {
      await WithdrawalWalletService.createWithdrawalFromAddress(payload, ctx.rootGetters['auth/accessToken']);
    } catch (e) {
      toast.error(e.message);
    }
  },
};

export const withdrawal_wallet: Module<WithdrawalWalletState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
