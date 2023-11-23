import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import RateSourceService from '@/services/RateSourceService';
import { decimal } from '@/utils';

const toast = useToast();

interface Rates {
  rateSource: string;
  rateScale: string;
}

const state: Rates = {
  rateSource: '',
  rateScale: '',
};

const getters: GetterTree<Rates, RootState> = {
};

const mutations: MutationTree<Rates> = {
  setRateSource(state, value: string) {
    state.rateSource = value;
  },

  setRateScale(state, value: string) {
    state.rateScale = value;
  },
};

const actions: ActionTree<Rates, RootState> = {
  async loadRateSource(context) {
    try {
      const { data } = await RateSourceService.getRateSource(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setRateSource', result.rate_source);
      context.commit('setRateScale', decimal(result.rate_scale));
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateRateSource(context, payload) {
    try {
      await RateSourceService.updateRateSource(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const rates: Module<Rates, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
