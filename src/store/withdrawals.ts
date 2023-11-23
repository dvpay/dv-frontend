import { Module, MutationTree, ActionTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import WithdrawalsService from '@/services/WithdrawalsService';
import { WithdrawalRulesResponse } from '@/services/WithdrawalsService/types';

const toast = useToast();

interface WithdrawalsState {
  withdrawalRules: Partial<WithdrawalRulesResponse>;
  isWithdrawalRulesLoaded: boolean;
}

const state: WithdrawalsState = {
  withdrawalRules: {},
  isWithdrawalRulesLoaded: false,
};

const mutations: MutationTree<WithdrawalsState> = {
  setWithdrawalRules(state, value) {
    state.withdrawalRules = value;
  },

  setIsWithdrawalRulesLoaded(state, value: boolean) {
    state.isWithdrawalRulesLoaded = value;
  },
};

const actions: ActionTree<WithdrawalsState, RootState> = {
  async loadWithdrawalRules(context) {
    try {
      const { data } = await WithdrawalsService.getWithdrawalRules(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setWithdrawalRules', result);
      context.commit('setIsWithdrawalRulesLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateWithdrawalRules(context, payload) {
    try {
      await WithdrawalsService.updateWithdrawalRules(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const withdrawals: Module<WithdrawalsState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
