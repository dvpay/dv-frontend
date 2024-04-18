import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/store/types';
import { useToast } from 'vue-toastification';
import CryptoES from 'crypto-es';
import StoreService from '@/services/StoreService';
import {
  StoreListResponse,
  ApiKeysResponse,
  CreateStoreRequest,
  StoreResponse,
  WebhookResponse,
  TestWebhookResponse,
  ReturnUrl,
} from '@/services/StoreService/types';
import { formatDate, shortName, numberFormatter } from '@/utils';
import router from '@/router';

const toast = useToast();

interface StoreMultiselectOptionType {
  title: string;
  value: string;
  checked: boolean;
}

interface StoresState {
  storeList: StoreListResponse[];
  isStoreListLoading: boolean;
  storeOptions: StoreMultiselectOptionType[];
  storeOptionsLocal: StoreMultiselectOptionType[],
  storeFilterTrigger: number;
  storeFilterBtnLoading: boolean;
  storeSelected: string;
  id: string;
  name: string;
  site: string | null;
  currency: string;
  rateSource: string;
  invoiceExpirationTime: number | null;
  addressHoldTime: null | number;
  acceptPaymentAtActualRate: boolean;
  apiKeyList: ApiKeysResponse[];
  webhookList: WebhookResponse[];
  isStoreLoading: boolean;
  testWebhookResponse: Partial<TestWebhookResponse>;
  returnUrls: Partial<ReturnUrl>;
  storeStatus: number;
  staticAddresses: number;
  minimalPayment: number;
}

const state: StoresState = {
  storeList: [],
  isStoreListLoading: false,
  storeOptions: [],
  storeOptionsLocal: [],
  storeFilterTrigger: 0,
  storeFilterBtnLoading: false,
  storeSelected: '',
  id: '',
  name: '',
  site: '',
  currency: '',
  rateSource: '',
  invoiceExpirationTime: null,
  addressHoldTime: null,
  acceptPaymentAtActualRate: false,
  apiKeyList: [],
  webhookList: [],
  isStoreLoading: false,
  testWebhookResponse: {},
  returnUrls: {},
  storeStatus: 0,
  staticAddresses: 0,
  minimalPayment: 1,
};

const getters: GetterTree<StoresState, RootState> = {
  getStoreList(state, rooGetters, rootState) {
    return state.storeList.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt, rootState.app.dateFormat, rootState.user.selectedLocation, false, false),
      invoicesAmount: item.invoicesAmount
        ? numberFormatter(item.invoicesAmount)
        : 0,
    }));
  },

  getStoreOptionsLocal(state) {
    if (state.storeOptionsLocal.length) {
      return state.storeOptionsLocal;
    }
    return JSON.parse(localStorage.getItem('store_options') || '[]');
  },

  getStoreSelectedOptionsLocal(state) {
    return state.storeOptionsLocal.filter((item) => item.checked);
  },

  isAllStoresSelected(state, getters) {
    return getters.getStoreOptionsLocal.length === getters.getStoreSelectedOptionsLocal.length;
  },
};

const mutations: MutationTree<StoresState> = {
  setStoreList(state, value: StoreListResponse[]) {
    state.storeList = value;
  },

  setIsStoreListLoading(state, value: boolean) {
    state.isStoreListLoading = value;
  },

  setStoreOptions(state, value: StoreListResponse[]) {
    state.storeOptions = [...value]
      .map((item) => ({
        title: item.name,
        value: item.id,
        checked: true,
      }));
  },

  setStoreOptionsLocal(state, value) {
    state.storeOptionsLocal = value;
    localStorage.setItem('store_options', JSON.stringify(value));
  },

  setStoreFilterTrigger(state) {
    state.storeFilterTrigger++;
  },

  setStoreFilterBtnLoading(state, value) {
    state.storeFilterBtnLoading = value;
  },

  setStore(state, value: StoreResponse) {
    const {
      id,
      name,
      site,
      currency,
      rateSource,
      invoiceExpirationTime,
      addressHoldTime,
      acceptPaymentAtActualRate,
      status,
      staticAddresses,
      minimalPayment,
    } = value;

    state.id = id;
    state.name = name;
    state.site = site;
    state.currency = currency;
    state.rateSource = rateSource;
    state.invoiceExpirationTime = invoiceExpirationTime;
    state.addressHoldTime = addressHoldTime;
    state.acceptPaymentAtActualRate = acceptPaymentAtActualRate;
    state.storeStatus = status;
    state.staticAddresses = staticAddresses;
    state.minimalPayment = minimalPayment;
  },

  removeStores(state) {
    state.storeSelected = '';
    state.storeOptions = [];
    localStorage.removeItem('store_options');
  },

  setApiKeyList(state, value: ApiKeysResponse[]) {
    state.apiKeyList = value;
  },

  setWebhookList(state, value: WebhookResponse[]) {
    state.webhookList = value;
  },

  setIsStoreLoading(state, value: boolean) {
    state.isStoreLoading = value;
  },

  setTestWebhookResponse(state, value: TestWebhookResponse) {
    state.testWebhookResponse = value;
  },

  setReturnUrls(state, value: ReturnUrl) {
    state.returnUrls = value;
  },
};

const actions: ActionTree<StoresState, RootState> = {
  async loadStores(context) {
    try {
      const { data } = await StoreService.getStores(context.rootGetters['auth/accessToken']);
      const { result } = data;

      const sortedStores = result
        .sort(StoreService.dateSort)
        .map((item) => ({
          ...item,
          name: shortName(item.name),
        }));

      context.commit('setStoreList', sortedStores);
      context.commit('setStoreOptions', sortedStores);

      const listLocal = context.state.storeOptions.map((item) => {
        return {
          ...item,
          checked: context.getters.getStoreOptionsLocal.reduce((acc: boolean, curr: StoreMultiselectOptionType) => {
            if (item.value === curr.value) {
              return curr.checked;
            }
            return acc;
          }, true),
        };
      });

      context.commit('setStoreOptionsLocal', listLocal);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },

  async getStoresForRequest(context) {
    const optionsArray = context.getters.getStoreOptionsLocal;
    const selectedArray = context.getters.getStoreOptionsLocal.filter((item: StoreMultiselectOptionType) => item.checked);
    if (optionsArray.length === selectedArray.length || !selectedArray.length) {
      return {};
    }
    return {
      stores: selectedArray.map((item: StoreMultiselectOptionType) => item.value),
    };
  },

  async loadStoreById(context, storeId) {
    try {
      const { data } = await StoreService.getStoreById(
        storeId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setStore', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async redirectAfterLoadStores(context) {
    if (context.state.storeOptions.length) {
      await router.push({ name: 'dashboard' });
    } else {
      await router.push({ name: 'store-create' });
    }
  },

  async createStore(context, payload: CreateStoreRequest) {
    try {
      await StoreService.createStore(payload, context.rootGetters['auth/accessToken']);
      await context.dispatch('loadStores');
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateStore(context, { storeId, payload }) {
    try {
      const { data } = await StoreService.updateStore(
        storeId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setStore', result);
      await context.dispatch('loadStores');
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateRateSource(context, { storeId, payload }) {
    try {
      const { data } = await StoreService.updateRateSource(
        storeId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setStore', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async createApiKey(context, storeId) {
    try {
      await StoreService.createApiKey(
        storeId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadApiKeys(context, storeId) {
    try {
      const { data } = await StoreService.getApiKeys(
        storeId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setApiKeyList', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateApiKey(context, { storeId, apiKeyId, payload }) {
    try {
      await StoreService.updateApiKey(
        storeId,
        apiKeyId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async deleteApiKey(context, { storeId, apiKeyId }) {
    try {
      await StoreService.removeApiKey(
        storeId,
        apiKeyId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async generateSecret() {
    const random = CryptoES.lib.WordArray.random(256 / 8);
    return CryptoES.SHA1(random).toString();
  },

  async loadWebhooks(context, storeId) {
    try {
      if (!Object.keys(context.rootState.dictionaries.dictionaries).length) {
        context.commit('dictionaries/setIsDictionariesLoading', true, { root: true });
        await context.dispatch('dictionaries/loadDictionaries', null, { root: true });
      }

      const { data } = await StoreService.getWebhooks(
        storeId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setWebhookList', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async createWebhook(context, { storeId, payload }) {
    try {
      await StoreService.createWebhook(
        storeId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateWebhook(context, { storeId, webhookId, payload }) {
    try {
      await StoreService.updateWebhook(
        storeId,
        webhookId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async deleteWebhook(context, { storeId, webhookId }) {
    try {
      await StoreService.removeWebhook(
        storeId,
        webhookId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async sendTestWebhook(context, { storeId, webhookId, payload }) {
    try {
      context.commit('setTestWebhookResponse', {});
      const { data } = await StoreService.sendTestWebhook(
        storeId,
        webhookId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      if (result.status >= 200 && result.status < 300) {
        toast.success('Webhook test: success');
      } else {
        toast.error('Webhook test: Something went wrong');
      }
      context.commit('setTestWebhookResponse', result);
    } catch (e) {
      toast.error(e.message);
      context.commit('setTestWebhookResponse', {});
      throw e;
    }
  },

  async loadReturnUrls(context, storeId) {
    try {
      const { data } = await StoreService.getReturnUrls(
        storeId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setReturnUrls', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateReturnUrls(context, { storeId, payload }) {
    try {
      await StoreService.updateReturnUrls(
        storeId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const stores: Module<StoresState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
