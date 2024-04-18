import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import PayerService from '@/services/PayerService';
import { PayerResponse, PayerAddress, PayerTransaction } from '@/services/PayerService/types';
import Decimal from 'decimal.js-light';
import { formatDate } from '@/utils';

const toast = useToast();

interface SelectedCryptocurrency {
  symbol: string;
  value: string;
}

interface SelectedNetwork {
  blockchain: string;
  value: string;
}

interface PayerState {
  payer: PayerResponse;
  payerAddresses: PayerAddress[];
  payerCurrencies: string[];
  rate: Record<string, string | number>;
  rateUsd: Record<string, string | number>;
  amount: Record<string, string | number>;
  amountUsd: number;
  loading: boolean;
  stepPayment: number;
  selectedCryptocurrency: SelectedCryptocurrency;
  selectedNetwork: SelectedNetwork;
  selectedCryptocurrencyAndNetwork: string;
}

const state: PayerState = {
  payer: {
    id: '',
    store_id: '',
    store_user_id: '',
    store: {
      id: '',
      name: '',
      status: 1,
      staticAddress: 1,
      returnUrl: null,
      siteUrl: null,
    },
    address: [],
    currency: [],
  },
  payerAddresses: [],
  payerCurrencies: [],
  rate: {},
  rateUsd: {},
  amount: {},
  amountUsd: 0,

  loading: true,
  stepPayment: 1,
  selectedCryptocurrency: {
    symbol: '',
    value: '',
  },
  selectedNetwork: {
    blockchain: '',
    value: '',
  },
  selectedCryptocurrencyAndNetwork: '',
};

const getters: GetterTree<PayerState, RootState> = {
  selectedPayerAddress(state) {
    return state.payerAddresses.find((item) => item.currency === state.selectedCryptocurrencyAndNetwork);
  },

  getTransactions(state, rooGetters, rootState): PayerTransaction[] | undefined {
    const selectedPayerAddress = state.payerAddresses.find((item) => item.currency === state.selectedCryptocurrencyAndNetwork);
    return selectedPayerAddress?.transactions.map((item) => ({
      ...item,
      created_at: formatDate(
        item.created_at,
        rootState.app.dateFormat,
        '',
      ),
    }));
  },

  getUnconfirmedTransactions(state, rooGetters, rootState): PayerTransaction[] | undefined {
    const selectedPayerAddress = state.payerAddresses.find((item) => item.currency === state.selectedCryptocurrencyAndNetwork);
    return selectedPayerAddress?.unconfirmedTransactions.map((item) => ({
      ...item,
      created_at: formatDate(
        item.created_at,
        rootState.app.dateFormat,
        '',
      ),
    }));
  },
};

const mutations: MutationTree<PayerState> = {
  setPayerData(state, value: PayerResponse) {
    state.payer = value;
  },

  setPayerAddresses(state, value: PayerAddress[]) {
    state.payerAddresses = [...value]
      .map((item) => ({
        blockchain: item.blockchain,
        currency: item.currency,
        address: item.address,
        transactions: item.transactions,
        unconfirmedTransactions: item.unconfirmedTransactions,
      }));
  },

  setPayerCurrencies(state, value: string[]) {
    state.payerCurrencies = value;
  },

  setRate(state, value: Record<string, string | number>) {
    state.rateUsd = Object.entries(value).reduce((acc, curr) => {
      acc[curr[0]] = new Decimal(curr[1]).toFixed();
      return { ...acc };
    }, {} as Record<string, string>);

    state.rate = Object.entries(value).reduce((acc, curr) => {
      acc[curr[0]] = curr[0] === 'BTC.Bitcoin'
        ? new Decimal(1).dividedBy(new Decimal(curr[1])).toFixed(8)
        : new Decimal(1).dividedBy(new Decimal(curr[1])).toFixed();
      return { ...acc };
    }, {} as Record<string, string | number>);
  },

  setAmount(state) {
    state.amount = Object.entries(state.rate).reduce((acc, curr) => {
      acc[curr[0]] = state.amountUsd
        ? new Decimal(curr[1]).mul(state.amountUsd).toFixed()
        : 0;
      return { ...acc };
    }, {} as Record<string, string | number>);
  },

  setAmountUsd(state, value: number) {
    state.amountUsd = value;
  },

  setLoading(state, value: boolean) {
    state.loading = value;
  },

  setStepPayment(state, value: number) {
    state.stepPayment = value;
  },

  setSelectedCryptocurrency(state, value: SelectedCryptocurrency) {
    state.selectedCryptocurrency = value;
  },

  setSelectedNetwork(state, value: SelectedNetwork) {
    state.selectedNetwork = value;
  },

  setSelectedCryptocurrencyAndNetwork(state, value: string) {
    state.selectedCryptocurrencyAndNetwork = value;
  },
};

const actions: ActionTree<PayerState, RootState> = {
  async loadPayer(context, payerId) {
    try {
      const { data } = await PayerService.getPayer(payerId);
      const { result } = data;
      context.commit('setPayerData', result);
      context.commit('setPayerAddresses', result.address);
      context.commit('setPayerCurrencies', result.currency);
      context.commit('setRate', result.rate);
      context.commit('setAmount');
      context.commit('setLoading', false);
    } catch (e) {
      context.commit('setLoading', false);
      toast.error(e.message);
      throw e;
    }
  },

  async loadPayerAddress(context, { payerId, currencyId }) {
    try {
      await PayerService.getAddress(payerId, currencyId);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const payer: Module<PayerState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
