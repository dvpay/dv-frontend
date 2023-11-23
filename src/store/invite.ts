import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import { PaginationResponse } from '@/api/types';
import InvitedUsersService from '@/services/InvitedUsersService';
import { formatDate } from '@/utils';

const toast = useToast();

interface InvitedUserForList {
  id: number;
  email: string;
  created_at: string;
  role: string;
  token: string;
}

interface InvitedUser {
  email: string;
  role: string;
  roles: string[];
  stores: string[];
  accept: boolean;
  invitedId: number | null;
}

interface InviteState {
  invitedUsers: InvitedUserForList[],
  invitedUser: InvitedUser;
  isInvitedUsersLoaded: boolean;
  pagination: Partial<PaginationResponse>;
}

const state: InviteState = {
  invitedUsers: [],
  invitedUser: {
    email: '',
    role: '',
    roles: [],
    stores: [],
    accept: false,
    invitedId: null,
  },
  isInvitedUsersLoaded: false,
  pagination: {},
};

const getters: GetterTree<InviteState, RootState> = {
  getInvitedUsers(state, rooGetters, rootState) {
    return state.invitedUsers.map((item) => ({
      ...item,
      created_at: formatDate(
        item.created_at,
        rootState.app.dateFormat,
        rootState.user.selectedLocation,
      ),
    }));
  },
};

const mutations: MutationTree<InviteState> = {
  setInvitedUsers(state, value: InvitedUserForList[]) {
    state.invitedUsers = value;
  },

  setInvitedUser(state, value: InvitedUser) {
    state.invitedUser = value;
  },

  setIsInvitedUsersLoaded(state, value: boolean) {
    state.isInvitedUsersLoaded = value;
  },

  setPagination(state, value: PaginationResponse) {
    state.pagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },
};

const actions: ActionTree<InviteState, RootState> = {
  async loadInvitedUsers(context, params) {
    try {
      const { data } = await InvitedUsersService.getInvitedUsers(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result, meta } = data;

      const resp = result.map((item) => ({
        id: item.id,
        email: item.email,
        created_at: item.created_at,
        role: item.role,
        roles: item.user
          ? item.user.roles.map((role: { name: string }) => role.name)
          : '',
        accept: !!item.user,
        token: item.token,
      }));

      context.commit('setInvitedUsers', resp);
      context.commit('setPagination', meta);
      context.commit('setIsInvitedUsersLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadInvitedUser(context, id) {
    try {
      if (!Object.keys(context.rootState.dictionaries.dictionaries).length) {
        context.commit('dictionaries/setIsDictionariesLoading', true, { root: true });
        await context.dispatch('dictionaries/loadDictionaries', null, { root: true });
      }

      if (!Object.keys(context.rootState.stores.storeList).length) {
        context.commit('stores/setIsStoreListLoading', true, { root: true });
        await context.dispatch('stores/loadStores', null, { root: true });
      }

      const { data } = await InvitedUsersService.getInvitedUser(
        id,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;

      context.commit('setInvitedUser', {
        email: result.email,
        role: result.role,
        roles: result.user
          ? result.user.roles.map((role: { name: string }) => role.name)
          : [],
        stores: result.user
          ? result.user.stores.map((store: { id: string }) => store.id)
          : [],
        accept: !!result.user,
        invitedId: result.invited_id,
      });
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateInvitedUser(context, { invitedId, payload }) {
    try {
      await InvitedUsersService.updateInvitedUser(
        invitedId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async sendInvite(context, payload) {
    try {
      await InvitedUsersService.sendInvite(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async acceptInvite(context, payload) {
    try {
      const { data } = await InvitedUsersService.acceptInvite(
        payload,
      );
      const { result } = data;
      return result.email;
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const invite: Module<InviteState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
