import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import InvoicesService from '@/services/InvoicesService';
import { InvoiceResponse, InvoiceAddresses } from '@/services/InvoicesService/types';
import { decimal, round } from '@/utils';

const toast = useToast();

interface InvoiceStatus {
  type: string;
  text: string;
  formHide: boolean;
}

interface SelectedCryptocurrency {
  symbol: string;
  value: string;
}

interface SelectedNetwork {
  blockchain: string;
  value: string;
}

interface InvoiceTimerData {
  total: number;
  minutes: string;
  seconds: string;
  hours: string;
  days: string;
}

interface InvoiceState {
  invoice: InvoiceResponse;
  invoiceAddresses: InvoiceAddresses[];
  invoiceMsgStatus: InvoiceStatus;
  loading: boolean;
  pages: Array<{ title: string, page: number }>;
  currentPage: number;
  stepPayment: number;
  selectedCryptocurrency: SelectedCryptocurrency;
  selectedNetwork: SelectedNetwork;
  selectedCryptocurrencyAndNetwork: string;
  isShowPaymentDetails: boolean;
  invoiceTimerData: InvoiceTimerData;
}

const state: InvoiceState = {
  invoice: {
    id: '',
    returnUrl: '',
    successUrl: '',
    currency: '',
    amount: '',
    leftAmount: '',
    expiredAt: '',
    description: '',
    status: '',
    addresses: [],
    paymentMethod: '',
    payerEmail: '',
    isConfirm: false,
    store: '',
    storeStatus: 1,
  },
  invoiceAddresses: [],
  invoiceMsgStatus: {
    type: 'default',
    text: '',
    formHide: false,
  },
  loading: true,
  pages: [
    {
      title: 'Payment',
      page: 1,
    },
    {
      title: 'How to pay',
      page: 2,
    },
    {
      title: 'FAQ',
      page: 3,
    },
  ],
  currentPage: 1,
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
  isShowPaymentDetails: false,
  invoiceTimerData: {
    total: 0,
    minutes: '',
    seconds: '',
    hours: '',
    days: '',
  },
};

const getters: GetterTree<InvoiceState, RootState> = {
  selectedCryptocurrencyIndex(state) {
    return (currency: string) => {
      return state.invoiceAddresses.findIndex((item: InvoiceAddresses) => {
        return item.currency === currency;
      });
    };
  },

  allTransactions(state) {
    return state.invoiceAddresses
      .map((item) => item.transactions)
      .flat();
  },
};

const mutations: MutationTree<InvoiceState> = {
  setInvoiceData(state, value: InvoiceResponse) {
    state.invoice = value;
  },

  clearInvoiceData(state) {
    state.invoice = Object.keys(state.invoice)
      .reduce<InvoiceResponse>((acc, curr) => {
        if (typeof state.invoice[curr as keyof InvoiceResponse] === 'string') {
          return { ...acc, [curr]: '' };
        }
        if (state.invoice[curr as keyof InvoiceResponse] instanceof Array) {
          return { ...acc, [curr]: [] };
        }
        return acc;
      }, <InvoiceResponse>{});

    state.invoiceAddresses = [];
  },

  setInvoiceAddresses(state, value: InvoiceAddresses[]) {
    state.invoiceAddresses = [...value]
      .sort(InvoicesService.currencySort)
      .map((item) => {
        if (item.rate < 1) {
          return {
            ...item,
            rate: decimal(item.rate),
            amount: decimal(item.amount),
            leftAmount: decimal(item.leftAmount),
            leftAmountUsd: Math.floor(Number(item.leftAmountUsd)),
          };
        }
        return {
          ...item,
          rate: round(item.rate, 2),
          amount: decimal(item.amount),
          leftAmount: decimal(item.leftAmount),
          leftAmountUsd: Math.floor(Number(item.leftAmountUsd)),
        };
      });
  },

  setInvoiceMsgStatus(state, value: [string, string, boolean]) {
    const [type, text, formHide] = value;
    state.invoiceMsgStatus = { type, text, formHide };
  },

  setLoading(state, value: boolean) {
    state.loading = value;
  },

  setCurrentPage(state, value: number) {
    state.currentPage = value;
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

  setIsShowPaymentDetails(state, value: boolean) {
    state.isShowPaymentDetails = value;
  },

  setInvoiceTimerData(state, value: InvoiceTimerData) {
    state.invoiceTimerData = value;
  },
};

const actions: ActionTree<InvoiceState, RootState> = {
  async loadInvoice(context, invoiceId) {
    try {
      const { data } = await InvoicesService.getInvoice(invoiceId);
      const { result } = data;
      context.commit('setInvoiceData', result);
      context.commit('setInvoiceAddresses', result.addresses);
      await context.dispatch('invoiceStatusCase', {
        status: result.status,
        isConfirm: result.isConfirm,
      });
    } catch (e) {
      toast.error(e.message);
      context.commit('setInvoiceMsgStatus', [
        'error',
        'Something went wrong, please try again',
      ]);
      throw e;
    }
  },

  async sendInvoiceToEmail(context, { invoiceId, payload }) {
    try {
      await InvoicesService.sendEmail(invoiceId, payload);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async confirmInvoice(context, invoiceId) {
    try {
      await InvoicesService.confirmInvoice(invoiceId);
      context.commit('setInvoiceMsgStatus', [
        'primary',
        'Waiting confirm payment',
        true,
      ]);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadInvoiceAddress(context, { invoiceId, currencyId }) {
    try {
      await InvoicesService.getAddress(invoiceId, currencyId);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  invoiceStatusCase(context, { status, isConfirm }) {
    switch (status) {
      case 'waiting':
        context.commit('setInvoiceMsgStatus', [
          'default',
          '',
          false,
        ]);
        break;
      case 'partially_paid':
        context.dispatch('isConfirmPaymentCase', isConfirm);
        break;
      case 'waiting_confirmations':
        context.dispatch('isConfirmPaymentCase', isConfirm);
        break;
      case 'paid':
      case 'overpaid':
        context.commit('setInvoiceMsgStatus', [
          'primary',
          'Your order successfully paid',
          true,
        ]);
        break;
      case 'success':
        context.commit('setInvoiceMsgStatus', [
          'success',
          'Your order successfully paid',
          true,
        ]);
        break;
      case 'expired':
      case 'partially_paid_expired':
        context.commit('setInvoiceMsgStatus', [
          'error',
          'Payment timeout expired',
          true,
        ]);
        break;
      case 'cancelled':
        context.commit('setInvoiceMsgStatus', [
          'error',
          'Invoice is cancelled',
          true,
        ]);
        break;
      default:
        context.commit('setInvoiceMsgStatus', [
          'default',
          '',
          false,
        ]);
    }
  },

  isConfirmPaymentCase(context, isConfirm) {
    if (isConfirm) {
      context.commit('setInvoiceMsgStatus', [
        'primary',
        'Waiting confirm payment',
        true,
      ]);
    } else {
      context.commit('setInvoiceMsgStatus', [
        'default',
        '',
        false,
      ]);
    }
  },

  async loadInvoiceData(context, invoiceId) {
    try {
      context.commit('setInvoiceMsgStatus', [
        'default',
        '',
      ]);
      await context.dispatch('loadInvoice', invoiceId);
      context.commit('setLoading', false);
    } catch (e) {
      context.commit('setLoading', false);
      throw e;
    }
  },

  invoiceTimer(context) {
    if (state.invoice.expiredAt) {
      const data = InvoicesService.invoiceTimer(state.invoice.expiredAt);
      context.commit('setInvoiceTimerData', data);
    }
  },
};

export const invoice: Module<InvoiceState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
