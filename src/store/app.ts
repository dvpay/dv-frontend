import { GetterTree, MutationTree, Module } from 'vuex';
import { RootState } from '@/store/types';

interface AppState {
  locale: string;
  localeOptions: Array<Record<string, string>>,
  progressBar: string;
  navCollapsed: Record<string, boolean>;
  dateFormat: string;
  dateFormatOptions: Array<Record<string, string>>;
}

const state: AppState = {
  locale: localStorage.getItem('locale') || 'en',
  localeOptions: [
    {
      title: 'English',
      value: 'en',
      flagIconClass: 'fi-us',
    },
    {
      title: 'Russian',
      value: 'ru',
      flagIconClass: 'fi-ru',
    },
    {
      title: 'Spanish',
      value: 'es',
      flagIconClass: 'fi-es',
    },
    {
      title: 'Indian',
      value: 'hi',
      flagIconClass: 'fi-in',
    },
  ],
  progressBar: 'stop',
  navCollapsed: JSON.parse(localStorage.getItem('nav_collapsed') || '{}'),
  dateFormat: localStorage.getItem('date_format') || 'DD.MM.YYYY HH:MM',
  dateFormatOptions: [
    {
      title: 'DD.MM.YYYY HH:MM',
      value: 'DD.MM.YYYY HH:MM',
    },
    {
      title: 'MM-DD-YYYY HH:MM A',
      value: 'MM-DD-YYYY HH:MM A',
    },
  ],
};

const getters: GetterTree<AppState, RootState> = {
  selectedLocaleOption(state) {
    return state.localeOptions.filter((item) => item.value === state.locale)[0];
  },

  getNavCollapsed(state) {
    return (collapseName: string) => {
      return state.navCollapsed[collapseName] || false;
    };
  },
};

const mutations: MutationTree<AppState> = {
  setLocale(state, value: string) {
    state.locale = value;
    localStorage.setItem('locale', value);
  },

  setProgressBar(state, value: string) {
    state.progressBar = value;
  },

  setNavCollapsed(state, value: Record<string, boolean>) {
    state.navCollapsed = { ...state.navCollapsed, ...value };
    localStorage.setItem('nav_collapsed', JSON.stringify(state.navCollapsed));
  },

  setDateFormat(state, value: string) {
    state.dateFormat = value;
    localStorage.setItem('date_format', value);
  },
};

export const app: Module<AppState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
};
