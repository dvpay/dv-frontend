import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import { PaginationResponse } from '@/api/types';
import InvoicesService from '@/services/InvoicesService';
import {
  InvoiceResponse,
  InvoiceAddresses,
  InvoicesResponse,
  AllInvoiceAddressesResponse,
  InvoiceDetailsResponse,
  InvoiceDetailsAddresses,
  InvoiceDetailsTransactions,
  CreateInvoiceRequest,
  InvoiceDetailsWebhooksHistory,
  InvoiceDetailsHistory,
} from '@/services/InvoicesService/types';
import { formatDate, decimal, round, shortName, isJson, numberFormatter } from '@/utils';

const toast = useToast();

interface InvoiceStatus {
  type: string;
  text: string;
  formHide: boolean;
}

interface InvoiceTimerData {
  total: number;
  minutes: string;
  seconds: string;
  hours: string;
  days: string;
}

interface InvoicesState {
  invoice: InvoiceResponse;
  invoiceAddresses: InvoiceAddresses[];
  invoiceMsgStatus: InvoiceStatus;
  invoiceTimerData: InvoiceTimerData;
  loading: boolean;
  invoices: InvoicesResponse[];
  pagination: Partial<PaginationResponse>;
  invoiceDetails: InvoiceDetailsResponse;
  invoiceDetailsAddresses: InvoiceDetailsAddresses[];
  invoiceDetailsTransactions: InvoiceDetailsTransactions[];
  invoiceDetailsWebhooks: InvoiceDetailsWebhooksHistory[];
  allInvoiceAddresses: AllInvoiceAddressesResponse[];
  allInvoiceAddressesPagination: Partial<PaginationResponse>;
  invoiceDetailsHistory: InvoiceDetailsHistory[];
}

const state: InvoicesState = {
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
  invoiceTimerData: {
    total: 0,
    minutes: '',
    seconds: '',
    hours: '',
    days: '',
  },
  loading: true,
  invoices: [],
  pagination: {},
  invoiceDetails: {
    storeName: '',
    id: '',
    storeId: '',
    status: '',
    createdAt: '',
    expiredAt: '',
    description: '',
    returnUrl: '',
    successUrl: '',
    amount: '',
    paidAmount: '',
    currency: '',
    addresses: [],
    transactions: [],
    webhookHistory: [],
    history: [],
    ip: '',
    userAgent: '',
  },
  invoiceDetailsAddresses: [],
  invoiceDetailsTransactions: [],
  invoiceDetailsWebhooks: [],
  allInvoiceAddresses: [],
  allInvoiceAddressesPagination: {},
  invoiceDetailsHistory: [],
};

const getters: GetterTree<InvoicesState, RootState> = {
  getInvoices(state, rooGetters, rootState) {
    return state.invoices.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
    }));
  },

  getInvoiceDetails(state, rooGetters, rootState) {
    return {
      ...state.invoiceDetails,
      createdAt: formatDate(state.invoiceDetails.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
      expiredAt: formatDate(state.invoiceDetails.expiredAt, rootState.app.dateFormat, rootState.user.selectedLocation),
    };
  },

  getInvoiceDetailsTransactions(state, rooGetters, rootState) {
    return state.invoiceDetailsTransactions.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
    }));
  },

  getInvoiceDetailsWebhookHistory(state, rooGetters, rootState) {
    return state.invoiceDetailsWebhooks.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
    }));
  },

  getInvoiceDetailsHistory(state, rooGetters, rootState) {
    return state.invoiceDetailsHistory.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
    }));
  },
};

const mutations: MutationTree<InvoicesState> = {
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

  setInvoiceTimerData(state, value: InvoiceTimerData) {
    state.invoiceTimerData = value;
  },

  setLoading(state, value: boolean) {
    state.loading = value;
  },

  setInvoices(state, value: InvoicesResponse[]) {
    state.invoices = [...value]
      .map((item) => {
        return {
          ...item,
          storeName: shortName(item.storeName),
          amount: item.amount
            ? numberFormatter(item.amount)
            : item.amount,
        };
      });
  },

  setPagination(state, value: PaginationResponse) {
    state.pagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },

  setInvoiceDetails(state, value: InvoiceDetailsResponse) {
    state.invoiceDetails = {
      ...value,
      amount: value.amount
        ? numberFormatter(value.amount)
        : value.amount,
    };
  },

  setInvoiceDetailsAddresses(state, value: InvoiceDetailsAddresses[]) {
    state.invoiceDetailsAddresses = [...value]
      .map((item) => {
        if (item.rate < 1) {
          return {
            ...item,
            rate: decimal(item.rate),
            balance: decimal(item.balance),
          };
        }
        return {
          ...item,
          rate: round(item.rate, 2),
          balance: decimal(item.balance),
        };
      });
  },

  setInvoiceDetailsTransactions(state, value: InvoiceDetailsTransactions[]) {
    state.invoiceDetailsTransactions = [...value]
      .sort(InvoicesService.dateSort)
      .map((item) => {
        return {
          ...item,
          amount: decimal(item.amount),
        };
      });
  },

  setInvoiceDetailsWebhooks(state, value: InvoiceDetailsWebhooksHistory[]) {
    state.invoiceDetailsWebhooks = [...value]
      .map((item) => {
        return {
          ...item,
          response: isJson(item.response)
            ? item.response
            : JSON.stringify(item.response),
        };
      });
  },

  clearInvoiceDetailsData(state) {
    state.invoiceDetails = Object.keys(state.invoiceDetails)
      .reduce<InvoiceDetailsResponse>((acc, curr) => {
        if (typeof state.invoiceDetails[curr as keyof InvoiceDetailsResponse] === 'string') {
          return { ...acc, [curr]: '' };
        }
        if (state.invoiceDetails[curr as keyof InvoiceDetailsResponse] instanceof Array) {
          return { ...acc, [curr]: [] };
        }
        return acc;
      }, <InvoiceDetailsResponse>{});

    state.invoiceDetailsAddresses = [];
    state.invoiceDetailsTransactions = [];
  },

  setAllInvoiceAddresses(state, value: AllInvoiceAddressesResponse[]) {
    state.allInvoiceAddresses = [...value].map((item) => {
      return {
        ...item,
        balance: item.currencyId === 'USDT.Tron'
          ? round(item.balance, 2)
          : decimal(item.balance),
        storeName: shortName(item.storeName),
      };
    });
  },

  setAllInvoiceAddressesPagination(state, value: PaginationResponse) {
    state.allInvoiceAddressesPagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },

  setInvoiceDetailsHistory(state, value: InvoiceDetailsHistory[]) {
    state.invoiceDetailsHistory = value;
  },
};

const actions: ActionTree<InvoicesState, RootState> = {
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
        context.commit('setInvoiceMsgStatus', [
          'primary',
          'Invoice is paid',
          true,
        ]);
        break;
      case 'success':
        context.commit('setInvoiceMsgStatus', [
          'success',
          'Invoice successfully completed',
          true,
        ]);
        break;
      case 'expired':
      case 'partially_paid_expired':
        context.commit('setInvoiceMsgStatus', [
          'error',
          'Invoice expired',
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

  async loadInvoices(context, params) {
    try {
      const stores = await context.dispatch('stores/getStoresForRequest', null, { root: true });
      const { data } = await InvoicesService.getInvoices(
        {
          ...params,
          ...stores,
        },
        context.rootGetters['auth/accessToken'],
      );
      const { result, meta } = data;
      context.commit('setPagination', meta);
      context.commit('setInvoices', result);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },

  async loadInvoiceDetails(context, invoiceId) {
    try {
      const { data } = await InvoicesService.getInvoiceDetails(
        invoiceId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setInvoiceDetails', result);
      context.commit('setInvoiceDetailsAddresses', result.addresses);
      context.commit('setInvoiceDetailsTransactions', result.transactions);
      context.commit('setInvoiceDetailsWebhooks', result.webhookHistory);
      context.commit('setInvoiceDetailsHistory', result.history);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async createInvoice(context, payload: CreateInvoiceRequest) {
    try {
      const { data } = await InvoicesService.createInvoice(
        payload,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      return result;
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadAllInvoiceAddresses(context, params) {
    try {
      const stores = await context.dispatch('stores/getStoresForRequest', null, { root: true });
      const { data } = await InvoicesService.getAllAddresses(
        {
          ...params,
          ...stores,
        },
        context.rootGetters['auth/accessToken'],
      );
      const { result, meta } = data;
      context.commit('setAllInvoiceAddressesPagination', meta);
      context.commit('setAllInvoiceAddresses', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const invoices: Module<InvoicesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
