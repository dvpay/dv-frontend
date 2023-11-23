import { Module, MutationTree, ActionTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import SettingsService from '@/services/SettingsService';
import { SettingsResponse } from '@/services/SettingsService/types';

const toast = useToast();

interface SettingsState {
  enabledRegistrationAuth: boolean;
  enabledRegistrationNoAuth: boolean;
}

const state: SettingsState = {
  enabledRegistrationAuth: true,
  enabledRegistrationNoAuth: true,
};

const mutations: MutationTree<SettingsState> = {
  setEnabledRegistrationAuth(state, value: SettingsResponse[]) {
    state.enabledRegistrationAuth = value
      .reduce((acc: boolean, curr: SettingsResponse) => {
        if (curr.name === 'registration_enable') {
          return curr.value;
        }
        return acc;
      }, true);
  },

  setEnabledRegistrationNoAuth(state, { value }: SettingsResponse) {
    state.enabledRegistrationNoAuth = value;
  },
};

const actions: ActionTree<SettingsState, RootState> = {
  async loadSettings(context) {
    try {
      const { data } = await SettingsService.getSettings(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setEnabledRegistrationAuth', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateSettings(context, payload) {
    try {
      const { data } = await SettingsService.updateSettings(
        context.rootGetters['auth/accessToken'],
        payload,
      );
      const { result } = data;
      context.commit('setEnabledRegistrationAuth', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async getIsRegistrationEnabled(context) {
    try {
      const { data } = await SettingsService.getIsRegistrationEnabled();
      const { result } = data;
      context.commit('setEnabledRegistrationNoAuth', result);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const settings: Module<SettingsState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
