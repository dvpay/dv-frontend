import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import CurrencyService from '@/services/CurrencyService';
import { RatesItemResponse } from '@/services/CurrencyService/types';
import { formatDate, decimal, gteTime } from '@/utils';

const toast = useToast();

interface RatesItemActual extends RatesItemResponse {
  fiveMinutesPast?: boolean;
}

interface CurrencyState {
  rates: Record<string, RatesItemActual[]>;
  ratesLoaded: boolean;
}

const state: CurrencyState = {
  rates: {},
  ratesLoaded: false,
};

const getters: GetterTree<CurrencyState, RootState> = {
  getRatesBinance(state, rooGetters, rootState): RatesItemActual[] {
    return state.rates['Binance'] ? state.rates['Binance'].map((item) => ({
      ...item,
      lastUpdate: formatDate(item.lastUpdate, rootState.app.dateFormat, rootState.user.selectedLocation),
    })) : [];
  },

  getRatesCoinGate(state, rooGetters, rootState): RatesItemActual[] {
    return state.rates['CoinGate'] ? state.rates['CoinGate'].map((item) => ({
      ...item,
      lastUpdate: formatDate(item.lastUpdate, rootState.app.dateFormat, rootState.user.selectedLocation),
    })) : [];
  },
};

const mutations: MutationTree<CurrencyState> = {
  setRates(state, value: Record<string, RatesItemActual[]>) {
    const data = Object.entries(value).map((item) => {
      return [
        item[0],
        item[1].map((elem) => {
          return {
            ...elem,
            rate: decimal(elem.rate),
            fiveMinutesPast: gteTime(elem.lastUpdate),
          };
        }),
      ];
    });

    state.rates = Object.fromEntries(data);
  },

  setRatesLoaded(state, value) {
    state.ratesLoaded = value;
  },
};

const actions: ActionTree<CurrencyState, RootState> = {
  async loadCurrencyRates(context) {
    try {
      const { data } = await CurrencyService.getRates(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setRates', result);
      context.commit('setRatesLoaded', true);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },
};

export const currency: Module<CurrencyState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
