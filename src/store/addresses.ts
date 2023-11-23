import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import { PaginationResponse } from '@/api/types';
import AddressesService from '@/services/AddressesService';
import {
  AddressBalancesResponse,
  InvoicesByAddressResponse,
  DataByAddressResponse, StatsHotWalletResponse,
} from '@/services/AddressesService/types';
import { decimal, formatDate, shortName, numberFormatter } from '@/utils';

const toast = useToast();

interface AddressesState {
  addressBalances: AddressBalancesResponse[];
  isAddressBalancesLoaded: boolean;
  addressBalancesPagination: Partial<PaginationResponse>;
  addressInvoices: InvoicesByAddressResponse[];
  isAddressInvoicesLoaded: boolean;
  addressInvoicesPagination: Partial<PaginationResponse>;
  addressData: Partial<DataByAddressResponse>;
  addressStats: Partial<StatsHotWalletResponse>;
}

const state: AddressesState = {
  addressBalances: [],
  isAddressBalancesLoaded: false,
  addressBalancesPagination: {},
  addressInvoices: [],
  isAddressInvoicesLoaded: false,
  addressInvoicesPagination: {},
  addressData: {},
  addressStats: {},
};

const getters: GetterTree<AddressesState, RootState> = {
  getAddressInvoices(state, rooGetters, rootState) {
    return state.addressInvoices.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation),
      statuses: item.statuses.length ? item.statuses.map((el) => ({
        ...el,
        status: el.status
          .split('_')
          .map((j) => (j.charAt(0)
            .toUpperCase() + j.slice(1)))
          .join(' '),
        datetime: formatDate(el.datetime, rootState.app.dateFormat, rootState.user.selectedLocation),
      })) : [],
    }));
  },
};

const mutations: MutationTree<AddressesState> = {
  setAddressBalances(state, value: AddressBalancesResponse[]) {
    state.addressBalances = value
      .map((item) => ({
        ...item,
        balance: item.currencyId === 'USDT.Tron'
          ? numberFormatter(item.balance)
          : decimal(item.balance),
        balanceUsd: numberFormatter(item.balanceUsd),
      }));
  },

  setAddressBalanceAfterTransfer(state, value: AddressBalancesResponse) {
    state.addressBalances = state.addressBalances.map((item) => {
      if (item.address === value.address && item.currencyId === value.currencyId) {
        return {
          ...item,
          balance: item.currencyId === 'USDT.Tron'
            ? numberFormatter(value.balance)
            : decimal(value.balance),
          balanceUsd: numberFormatter(value.balanceUsd),
          balanceFromExplorer: 0,
        };
      }
      return item;
    });
  },

  setIsAddressBalancesLoaded(state, value) {
    state.isAddressBalancesLoaded = value;
  },

  setAddressStats(state, value) {
    state.addressStats = value;
  },

  setAddressBalancesPagination(state, value: PaginationResponse) {
    state.addressBalancesPagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },

  setAddressInvoices(state, value: InvoicesByAddressResponse[]) {
    state.addressInvoices = [...value]
      .map((item) => {
        return {
          ...item,
          storeName: shortName(item.storeName),
        };
      });
  },

  setIsAddressInvoicesLoaded(state, value) {
    state.isAddressInvoicesLoaded = value;
  },

  setAddressInvoicesPagination(state, value: PaginationResponse) {
    state.addressInvoicesPagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },

  setAddressData(state, value: DataByAddressResponse) {
    state.addressData = value;
  },
};

const actions: ActionTree<AddressesState, RootState> = {
  async loadAddressBalances(context, params) {
    try {
      const { data } = await AddressesService.getAddressBalances(
        params,
        context.rootGetters['auth/accessToken'],
      );

      const {
        result,
        meta
      } = data;
      context.commit('setAddressBalancesPagination', meta);
      context.commit('setAddressBalances', result);
      context.commit('setIsAddressBalancesLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async transferFromAddress(context, payload) {
    try {
      const { data } = await AddressesService.transferFromAddress(
        payload,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setAddressBalanceAfterTransfer', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadInvoicesByAddress(context, params) {
    try {
      const stores = await context.dispatch('stores/getStoresForRequest', null, { root: true });
      const { data } = await AddressesService.getInvoicesByAddress(
        {
          ...params,
          ...stores,
        },
        context.rootGetters['auth/accessToken'],
      );
      const {
        result,
        meta
      } = data;
      context.commit('setAddressInvoicesPagination', meta);
      context.commit('setAddressInvoices', result);
      context.commit('setIsAddressInvoicesLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async getDataByAddress(context, address) {
    try {
      const { data } = await AddressesService.getDataByAddress(
        address,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setAddressData', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadAddressesStats(context, blockchain) {
    try {
      const { data } = await AddressesService.getStatsHotWallets(
        blockchain,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setAddressStats', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const addresses: Module<AddressesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
