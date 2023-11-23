import { ActionTree, Module, MutationTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import DictionariesService from '@/services/DictionariesService';

const toast = useToast();

interface SelectOptions {
  title: string;
  value: string;
}

interface CurrenciesResult {
  code: string;
  contractAddress: string;
  id: string;
  isFiat: boolean;
  name: string;
  precision: number;
}

interface Blockchain {
  name: string;
  title: string;
  importMethods: string[];
  currencies: string[];
  nativeToken: string;
}

interface BlockchainsResult {
  [key: string]: Blockchain;
}

interface ExchangeItem {
  name: string;
  slug: string;
}

export interface ExchangeCurrencies {
  exchange: string;
  slug: string;
  currencies: Record<string, string[]>
}

interface DictionariesState {
  dictionaries: RootState;
  isDictionariesLoading: boolean;
  currencies: CurrenciesResult[];
  rateSources: SelectOptions[];
  webhookTypes: SelectOptions[];
  blockchains: BlockchainsResult;
  withdrawalIntervals: Record<string, string>[];
  locations: string[];
  exchanges: ExchangeItem[];
  exchangeCurrencies: ExchangeCurrencies[];
  api: Record<string, string>;
  roles: string[];
  chain: string[];
  version: string;
}

const state: DictionariesState = {
  dictionaries: {},
  isDictionariesLoading: false,
  currencies: [],
  rateSources: [],
  webhookTypes: [],
  blockchains: {},
  withdrawalIntervals: [],
  locations: [],
  exchanges: [],
  exchangeCurrencies: [],
  api: {},
  roles: [],
  chain: [],
  version: ''
};

const getters: GetterTree<DictionariesState, RootState> = {
  blockchainsArray(state) {
    return Object.keys(state.blockchains).sort();
  },

  fiatCurrencies(state) {
    return state.currencies
      .filter((elem) => elem.isFiat)
      .map((item) => ({
        title: item.name,
        value: item.id,
      }));
  },

  cryptoCurrencies(state) {
    return state.currencies
      .filter((elem) => !elem.isFiat)
      .map((item) => ({
        title: `${item.name} (${item.id.split('.')[1]})`,
        value: item.id,
      }));
  },

  cryptoCurrencyPrecision(state) {
    return (id: string) => {
      return state.currencies
        .filter((elem) => !elem.isFiat)
        .reduce((acc, curr) => {
          if (curr.id === id) {
            return curr.precision;
          }
          return acc;
        }, 0);
    };
  },

  nativeToken(state) {
    return (blockchain: string) => {
      return state.blockchains[blockchain]?.nativeToken || '';
    };
  },

  exchangesOptions(state) {
    return state.exchangeCurrencies.reduce((acc: SelectOptions[], curr) => {
      if (Object.keys(curr.currencies).length) {
        acc.push({
          title: curr.exchange,
          value: curr.slug,
        });
      }
      return acc;
    }, []);
  },

  getExchangeCurrencies(state) {
    return state.exchangeCurrencies
      .filter((item: any) => Object.keys(item.currencies).length);
  },
};

const mutations: MutationTree<DictionariesState> = {
  setDictionaries(state, value: RootState) {
    state.dictionaries = value;
  },

  setIsDictionariesLoading(state, value: boolean) {
    state.isDictionariesLoading = value;
  },

  setCurrencies(state, value: CurrenciesResult[]) {
    state.currencies = value;
  },

  setRateSources(state, value: string[]) {
    state.rateSources = value.map((item) => ({
      title: item,
      value: item,
    }));
  },

  setWebhookTypes(state, value: Record<string, string>) {
    state.webhookTypes = Object.entries(value).map((item) => {
      return {
        title: item[1],
        value: item[0],
      };
    });
  },

  setBlockchains(state, value: BlockchainsResult) {
    state.blockchains = value;
  },

  setWithdrawalIntervals(state, value: Record<string, string>) {
    state.withdrawalIntervals = Object.entries(value)
      .reduce((acc, curr) => {
        acc.push({
          title: curr[1],
          value: curr[0],
        });
        return acc;
      }, [] as Record<string, string>[]);
  },

  setLocations(state, value: string[]) {
    state.locations = value;
  },

  setExchanges(state, value: ExchangeItem[]) {
    state.exchanges = value;
  },

  setExchangeCurrencies(state, value: ExchangeCurrencies[]) {
    state.exchangeCurrencies = value;
  },

  setApi(state, value: Record<string, string>) {
    state.api = value;
  },

  setRoles(state, value: string[]) {
    state.roles = value;
  },

  setChain(state, value: string[]) {
    state.chain = value;
  },
  setVersion(state, value: string) {
    state.version = value
  }
};

const actions: ActionTree<DictionariesState, RootState> = {
  async loadDictionaries(context) {
    try {
      const { data } = await DictionariesService.getDictionaries();
      const { result } = data;
      context.commit('setDictionaries', result);
      context.commit('setCurrencies', result.currencies);
      context.commit('setRateSources', result.rateSources);
      context.commit('setWebhookTypes', result.webhookTypes);
      context.commit('setBlockchains', result.blockchains);
      context.commit('setWithdrawalIntervals', result.withdrawalIntervals);
      context.commit('setLocations', result.locations);
      context.commit('setExchanges', result.exchanges);
      context.commit('setExchangeCurrencies', result.exchangeCurrencies);
      context.commit('setApi', result.api);
      context.commit('setRoles', result.roles);
      context.commit('setChain', result.chain);
      context.commit('setVersion', result.version);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const dictionaries: Module<DictionariesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
