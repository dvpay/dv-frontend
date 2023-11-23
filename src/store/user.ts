import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import UserService from '@/services/UserService';
import { UserInfoResponse } from '@/services/UserService/types';

const toast = useToast();

interface UserState {
  userInfo: UserInfoResponse;
  selectedLocation: string;
  isUserInfoLoaded: boolean;
  isUserInfoLoading: boolean;
}

const state: UserState = {
  userInfo: {
    email: '',
    roles: [],
    telegramNotification: '',
    location: '',
    language: '',
    isEmailVerified: false,
    phone: '',
    google2faSecret: null,
    google2faUrl: null,
    google2faStatus: false,
    permission: {
      storePay: false,
      withdrawal: false,
    },
  },
  selectedLocation: '',
  isUserInfoLoaded: false,
  isUserInfoLoading: false,
};

const getters: GetterTree<UserState, RootState> = {
  userRole(state) {
    if (state.userInfo.roles.some((item) => item === 'root')) {
      return 'root';
    }
    if (state.userInfo.roles.some((item) => (item !== 'root' && item === 'admin'))) {
      return 'admin';
    }
    if (state.userInfo.roles.some((item) => (item !== 'root' && item !== 'admin' && item === 'support'))) {
      return 'support';
    }
    return '';
  },
};

const mutations: MutationTree<UserState> = {
  setUserInfo(state, value: UserInfoResponse) {
    state.userInfo = {
      ...value,
      location: value.location ? value.location : '',
    };
  },

  setIsUserInfoLoaded(state, value: boolean) {
    state.isUserInfoLoaded = value;
  },

  setIsUserInfoLoading(state, value: boolean) {
    state.isUserInfoLoading = value;
  },

  setSelectedLocation(state, value: string) {
    state.selectedLocation = value;
  },
};

const actions: ActionTree<UserState, RootState> = {
  async loadUserInfo(context) {
    try {
      const { data } = await UserService.getUserInfo(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setUserInfo', result);
      context.commit('setSelectedLocation', result.location ? result.location : '');
      context.commit('setIsUserInfoLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateUserInfo(context, payload) {
    try {
      await UserService.updateUserInfo(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async changePassword(context, payload) {
    try {
      await UserService.changePassword(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async sendEmailConfirmation(context) {
    try {
      await UserService.sendEmailConfirmation(
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async verifyEmail(context, payload) {
    try {
      const { data } = await UserService.verifyEmail(payload);
      const { result } = data;
      if (!context.rootGetters['auth/accessToken']) {
        context.commit('auth/setAccessToken', result.token, { root: true });
      }
      if (!Object.keys(context.rootState.dictionaries.dictionaries).length) {
        await context.dispatch('dictionaries/loadDictionaries', null, { root: true });
      }
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  },

  async toggleTwoFa(context, payload) {
    try {
      await UserService.toggleTwoFa(
        payload,
        context.rootGetters['auth/accessToken'],
      );
      await context.dispatch('loadUserInfo');
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async validateTwoFa(context, payload) {
    try {
      await UserService.validateTwoFa(
        payload,
        context.rootGetters['auth/accessToken'],
      );
      await context.dispatch('loadUserInfo');
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const user: Module<UserState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
