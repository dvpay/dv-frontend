import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import { PaginationResponse } from '@/api/types';
import UsersService from '@/services/UsersService';
import { formatDate } from '@/utils';

const toast = useToast();

interface UserForList {
  id: number;
  email: string;
  created_at: string;
  processing_owner_id: string;
  roles: Array<{ name: string }>;
}

interface User {
  email: string;
  roles: string[];
}

interface UsersState {
  allUserList: UserForList[];
  user: User;
  pagination: Partial<PaginationResponse>;
}

const state: UsersState = {
  allUserList: [],
  user: {
    email: '',
    roles: [],
  },
  pagination: {},
};

const getters: GetterTree<UsersState, RootState> = {
  getAllUserList(state, rooGetters, rootState) {
    return state.allUserList.map((item) => ({
      ...item,
      created_at: formatDate(
        item.created_at,
        rootState.app.dateFormat,
        rootState.user.selectedLocation,
      ),
    }));
  },
};

const mutations: MutationTree<UsersState> = {
  setAllUserList(state, value: UserForList[]) {
    state.allUserList = value;
  },

  setUser(state, value: User) {
    state.user = value;
  },

  setPagination(state, value: PaginationResponse) {
    state.pagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },
};

const actions: ActionTree<UsersState, RootState> = {
  async loadAllUsers(context, params) {
    try {
      const { data } = await UsersService.getAllUsers(
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result, meta } = data;

      const resp = result.map((item) => ({
        id: item.id,
        email: item.email,
        created_at: item.createdAt,
        processing_owner_id: item.processing_owner_id,
        roles: item.roles.map((role: { name: string }) => role.name),
      }));

      context.commit('setAllUserList', resp);
      context.commit('setPagination', meta);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadUser(context, userId) {
    try {
      if (!Object.keys(context.rootState.dictionaries.dictionaries).length) {
        context.commit('dictionaries/setIsDictionariesLoading', true, { root: true });
        await context.dispatch('dictionaries/loadDictionaries', null, { root: true });
      }

      const { data } = await UsersService.getUser(
        userId,
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setUser', {
        email: result[0].email,
        roles: result[0].roles,
      });
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async deleteUser(context, userId) {
    try {
      await UsersService.deleteUser(
        userId,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async updateUserRoles(context, { userId, payload }) {
    try {
      await UsersService.updateUserRoles(
        userId,
        payload,
        context.rootGetters['auth/accessToken'],
      );
      await context.dispatch('user/loadUserInfo', null, { root: true });
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const users: Module<UsersState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
