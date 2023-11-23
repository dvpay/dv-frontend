import { ActionTree, MutationTree, Module, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import TransactionsService from '@/services/TransactionsService';
import { SearchTxResponse, TxRelatedWebhooks, TxRelatedInvoices } from '@/services/TransactionsService/types';
import { formatDate, decimal, removePropsFromObject, isJson, numberFormatter } from '@/utils';

const toast = useToast();

interface TransactionsState {
  transactionDetails: Partial<Omit<SearchTxResponse, 'relatedInvoices' | 'relatedWebhooks'>>;
  transactionInvoice: Partial<TxRelatedInvoices>;
  transactionWebhooks: TxRelatedWebhooks[];
  transactionInvoices: TxRelatedInvoices[];
}

const state: TransactionsState = {
  transactionDetails: {},
  transactionInvoice: {},
  transactionWebhooks: [],
  transactionInvoices: [],
};

const getters: GetterTree<TransactionsState, RootState> = {
  getTransactionDetails(state, rooGetters, rootState) {
    return state.transactionDetails.time
      ? {
        ...state.transactionDetails,
        time: formatDate(
          state.transactionDetails.time,
          rootState.app.dateFormat,
          rootState.user.selectedLocation,
        ),
      }
      : {
        ...state.transactionDetails,
      };
  },

  getTransactionInvoice(state, rooGetters, rootState) {
    return state.transactionInvoice.createdAt && state.transactionInvoice.expiredAt
      ? {
        ...state.transactionInvoice,
        createdAt: formatDate(
          state.transactionInvoice.createdAt,
          rootState.app.dateFormat,
          rootState.user.selectedLocation,
        ),
        expiredAt: formatDate(
          state.transactionInvoice.expiredAt,
          rootState.app.dateFormat,
          rootState.user.selectedLocation,
        ),
      }
      : {};
  },

  getTransactionWebhooks(state, rooGetters, rootState) {
    return state.transactionWebhooks.map((item) => ({
      ...item,
      createdAt: formatDate(
        item.createdAt,
        rootState.app.dateFormat,
        rootState.user.selectedLocation,
      ),
    }));
  },

  getTransactionInvoices(state, rooGetters, rootState) {
    return state.transactionInvoices.map((item) => ({
      ...item,
      createdAt: formatDate(
        item.createdAt,
        rootState.app.dateFormat,
        rootState.user.selectedLocation,
      ),
      expiredAt: formatDate(
        item.expiredAt,
        rootState.app.dateFormat,
        rootState.user.selectedLocation,
      ),
    }));
  },
};

const mutations: MutationTree<TransactionsState> = {
  setTransactionDetails(state, value) {
    state.transactionDetails = Object.keys(value).length ? {
      ...removePropsFromObject(value, ['invoice', 'webhooks', 'invoices']),
      amount: value.currency === 'USDT'
        ? numberFormatter(value.amount ?? 0)
        : decimal(value.amount ?? 0),
      amountUsd: numberFormatter(value.amountUsd ?? 0),
      rate: decimal(value.rate ?? 0),
    } : {};
  },

  setTransactionInvoice(state, value = {} as TxRelatedInvoices) {
    state.transactionInvoice = Object.keys(value).length ? {
      ...value,
      amount: numberFormatter(value.amount),
    } : {};
  },

  setTransactionWebhooks(state, value = [] as TxRelatedWebhooks[]) {
    state.transactionWebhooks = [...value]
      .map((item) => {
        return {
          ...item,
          response: isJson(item.response)
            ? item.response
            : JSON.stringify(item.response),
        };
      });
  },

  setTransactionInvoices(state, value = [] as TxRelatedInvoices[]) {
    state.transactionInvoices = [...value]
      .map((item) => {
        return {
          ...item,
          amount: decimal(item.amount),
        };
      });
  },

  resetData(state) {
    state.transactionDetails = {};
    state.transactionInvoice = {};
    state.transactionWebhooks = [];
    state.transactionInvoices = [];
  },
};

const actions: ActionTree<TransactionsState, RootState> = {
  async searchTransaction(context, transactionId) {
    try {
      const { data } = await TransactionsService.searchTransaction(
        transactionId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setTransactionDetails', result);
      context.commit('setTransactionInvoice', result.relatedInvoices);
      context.commit('setTransactionInvoices', result.probablyRelatedInvoices);
      context.commit('setTransactionWebhooks', result.relatedWebhooks);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      context.commit('resetData');
      toast.error(e.message);
      throw e;
    }
  },

  async reSendWebhook(context, invoiceId) {
    try {
      await TransactionsService.reSendWebhook(
        invoiceId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async attachInvoice(context, { transactionId, invoiceId }) {
    try {
      await TransactionsService.attachInvoice(
        transactionId,
        invoiceId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      if (e.status === 400) {
        toast.error('This transaction not related to this invoice');
      } else if (e.status === 409) {
        toast.error('This transaction already related to this invoice');
      } else {
        toast.error(e.message);
      }
      throw e;
    }
  },

  async attachTransactionToPayer(context, transactionId) {
    try {
      await TransactionsService.attachTransactionToPayer(
        transactionId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async forceAttachInvoice(context, { transactionId, invoiceId }) {
    try {
      await TransactionsService.forceAttachInvoice(
        transactionId,
        invoiceId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};

export const transactions: Module<TransactionsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
