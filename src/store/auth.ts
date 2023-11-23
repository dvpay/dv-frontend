import {
  GetterTree, MutationTree, ActionTree, Module,
} from 'vuex';
import Cookies from 'js-cookie';
import { useToast } from 'vue-toastification';
import AuthService from '@/services/AuthService';
import {
  LoginUserRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  SetNewPasswordRequest,
} from '@/services/AuthService/types';
import { RootState } from '@/store/types';
import { Token } from '@/api/types';
import router from '@/router';

const toast = useToast();

interface AuthState {
  accessToken: Token;
}

const state: AuthState = {
  accessToken: null,
};

const getters: GetterTree<AuthState, RootState> = {
  isAuth(state, getters) {
    return !!getters.accessToken;
  },

  accessToken(state) {
    return state.accessToken || Cookies.get('access_token');
  },
};

const mutations: MutationTree<AuthState> = {
  setAccessToken(state, value: Token) {
    state.accessToken = value;
    if (value) {
      Cookies.set('access_token', value);
    }
  },

  removeAccessToken(state) {
    state.accessToken = null;
    Cookies.remove('access_token');
  },
};

const actions: ActionTree<AuthState, RootState> = {
  async loginUser(context, payload: LoginUserRequest) {
    try {
      const { data } = await AuthService.loginUser(payload);
      const { result } = data;
      context.commit('setAccessToken', result.token);
      if (!Object.keys(context.rootState.dictionaries.dictionaries).length) {
        await context.dispatch('dictionaries/loadDictionaries', null, { root: true });
      }
    } catch (e) {
      if (e.status === 422) {
        throw new Error('twofa');
      }
      toast.error(e.message);
      throw e;
    }
  },

  async registerUser(_, payload: RegisterUserRequest) {
    try {
      await AuthService.registerUser(payload);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async resetPassword(_, payload: ResetPasswordRequest) {
    try {
      await AuthService.resetPassword(payload);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async setNewPassword(_, payload: SetNewPasswordRequest) {
    try {
      await AuthService.setNewPassword(payload);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async logoutUser(context) {
    try {
      await AuthService.logoutUser(context.getters.accessToken);
      context.commit('removeAccessToken');
      await router.push({ name: 'login' });
      context.commit('stores/removeStores', null, { root: true });
      context.commit('resetStore', null, { root: true });
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
