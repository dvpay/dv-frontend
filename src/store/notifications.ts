import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import NotificationsService from '@/services/NotificationsService';
import {
  AllNotificationsListType,
  Notification,
  NotificationTarget,
} from '@/services/NotificationsService/types';

const toast = useToast();

interface NotificationsState {
  allNotifications: {
    system: Notification[];
    events: Notification[];
    reports: Notification[];
  },
  userNotifications: {
    system: Notification[];
    events: Notification[];
    reports: Notification[];
  },
  isNotificationsLoaded: boolean;
  notificationsLoadTrigger: number;

  allNotificationsTargets: NotificationTarget[];
  userNotificationsTargets: NotificationTarget[];
  isNotificationsTargetsLoaded: boolean;
  notificationsLoadTargetsTrigger: number;
}

const state: NotificationsState = {
  allNotifications: {
    system: [],
    events: [],
    reports: [],
  },
  userNotifications: {
    system: [],
    events: [],
    reports: [],
  },
  isNotificationsLoaded: false,
  notificationsLoadTrigger: 0,

  allNotificationsTargets: [],
  userNotificationsTargets: [],
  isNotificationsTargetsLoaded: false,
  notificationsLoadTargetsTrigger: 0,
};

const getters: GetterTree<NotificationsState, RootState> = {
};

const mutations: MutationTree<NotificationsState> = {
  setAllNotifications(state, value: AllNotificationsListType[]) {
    state.allNotifications.system = value[0].notification;
    state.allNotifications.events = value[1].notification;
    state.allNotifications.reports = value[2].notification;
  },

  setUserNotifications(state, value: Notification[]) {
    value.forEach((item) => {
      if (item.id >= 1 && item.id <= 2) {
        state.userNotifications.system.push(item);
      }
      if (item.id >= 3 && item.id <= 7) {
        state.userNotifications.events.push(item);
      }
      if (item.id >= 8 && item.id <= 10) {
        state.userNotifications.reports.push(item);
      }
    });
  },

  setIsNotificationsLoaded(state, value: boolean) {
    state.isNotificationsLoaded = value;
    state.notificationsLoadTrigger += 1;
  },

  setAllNotificationsTargets(state, value: NotificationTarget[]) {
    state.allNotificationsTargets = value;
  },

  setUserNotificationsTargets(state, value: NotificationTarget[]) {
    state.userNotificationsTargets = value;
  },

  setIsNotificationsTargetsLoaded(state, value: boolean) {
    state.isNotificationsTargetsLoaded = value;
    state.notificationsLoadTargetsTrigger += 1;
  },
};

const actions: ActionTree<NotificationsState, RootState> = {
  async startTelegramBot(context) {
    try {
      const { data } = await NotificationsService.startTelegramBot(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      const anchor = document.createElement('a');
      anchor.href = result[0];
      anchor.target = '_blank';
      anchor.click();
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async enableTelegramNotifications(context, payload) {
    try {
      await NotificationsService.enableTelegramNotifications(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadNotifications(context) {
    try {
      await context.dispatch('loadAllNotificationsList');
      await context.dispatch('loadUserNotificationsList');
      context.commit('setIsNotificationsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadAllNotificationsList(context) {
    try {
      const { data } = await NotificationsService.getAllNotificationsList(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setAllNotifications', result);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  },

  async loadUserNotificationsList(context) {
    try {
      const { data } = await NotificationsService.getUserNotificationsList(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setUserNotifications', result);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  },

  async saveUserNotifications(context, payload) {
    try {
      await NotificationsService.saveUserNotifications(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadNotificationsTargets(context) {
    try {
      await context.dispatch('loadAllNotificationsTargets');
      await context.dispatch('loadUserNotificationsTargets');
      context.commit('setIsNotificationsTargetsLoaded', true);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },

  async loadAllNotificationsTargets(context) {
    try {
      const { data } = await NotificationsService.getAllNotificationsTargets(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setAllNotificationsTargets', result);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  },

  async loadUserNotificationsTargets(context) {
    try {
      const { data } = await NotificationsService.getUserNotificationsTargets(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setUserNotificationsTargets', result);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  },

  async saveUserNotificationsTargets(context, payload) {
    try {
      await NotificationsService.saveUserNotificationsTargets(
        payload,
        context.rootGetters['auth/accessToken'],
      );
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const notifications: Module<NotificationsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
