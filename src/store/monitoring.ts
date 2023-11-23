import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { useToast } from 'vue-toastification';
import { RootState } from '@/store/types';
import MonitoringService from '@/services/MonitoringService';
import {
  StatusAllResponse,
  StatusHistoryDetailsResponse,
  ServerMonitoringDisk,
  ServerMonitoringQueuesItem,
} from '@/services/MonitoringService/types';
import { PaginationResponse } from '@/api/types';
import { formatDate } from '@/utils';

const toast = useToast();

interface MonitoringState {
  statusAll: StatusAllResponse[];
  statusHistoryDetails: StatusHistoryDetailsResponse[],
  statusHistoryDetailsLogsPagination: Partial<PaginationResponse>;
  isStatusHistoryDetailsLoaded: boolean;
  serverMonitoringDisk: ServerMonitoringDisk;
  serverMonitoringQueues: ServerMonitoringQueuesItem[];
}

const state: MonitoringState = {
  statusAll: [],
  statusHistoryDetails: [],
  statusHistoryDetailsLogsPagination: {},
  isStatusHistoryDetailsLoaded: false,
  serverMonitoringDisk: {
    diskTotal: '',
    diskFree: '',
    diskSpaceFreePercent: 0,
  },
  serverMonitoringQueues: [],
};

const getters: GetterTree<MonitoringState, RootState> = {
  getStatusAll(state, rooGetters, rootState) {
    return state.statusAll.map((item) => ({
      ...item,
      lastTrigger: formatDate(
        item.lastTrigger,
        rootState.app.dateFormat,
        rootState.user.selectedLocation,
      ),
    }));
  },

  getStatusHistoryDetailsServiceName(state) {
    return (serviceId: number) => {
      return state.statusAll
        .filter((item) => Number(item.serviceId) === Number(serviceId))[0]?.name;
    };
  },

  getStatusHistoryDetails(state, rooGetters, rootState) {
    return state.statusHistoryDetails.map((item) => ({
      ...item,
      startAt: formatDate(item.startAt, rootState.app.dateFormat, rootState.user.selectedLocation),
      log: item.log.map((el) => ({
        ...el,
        createdAt: formatDate(
          el.createdAt,
          rootState.app.dateFormat,
          rootState.user.selectedLocation,
        ),
      })),
    }));
  },
};

const mutations: MutationTree<MonitoringState> = {
  setStatusAll(state, value: StatusAllResponse[]) {
    state.statusAll = [...value];
  },

  setStatusHistoryDetails(state, value: StatusHistoryDetailsResponse[]) {
    state.statusHistoryDetails = [...value];
  },

  setStatusHistoryDetailsLogsPagination(state, value: PaginationResponse) {
    state.statusHistoryDetailsLogsPagination = {
      total: value.total,
      per_page: value.per_page,
      current_page: value.current_page,
    };
  },

  clearStatusHistoryDetails(state) {
    state.statusHistoryDetails = [];
  },

  setIsStatusHistoryDetailsLoaded(state, value: boolean) {
    state.isStatusHistoryDetailsLoaded = value;
  },

  setServerMonitoringDisk(state, value: ServerMonitoringDisk) {
    state.serverMonitoringDisk = value;
  },

  setServerMonitoringQueues(state, value: ServerMonitoringQueuesItem[]) {
    state.serverMonitoringQueues = [...value];
  },
};

const actions: ActionTree<MonitoringState, RootState> = {
  async loadStatusAll(context) {
    try {
      const { data } = await MonitoringService.getStatusAll(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setStatusAll', result);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },

  async loadStatusHistoryDetails(context, { serviceId, params }) {
    try {
      const { data } = await MonitoringService.getStatusHistoryDetails(
        serviceId,
        params,
        context.rootGetters['auth/accessToken'],
      );
      const { result, meta } = data;
      context.commit('setStatusHistoryDetails', result);
      context.commit('setStatusHistoryDetailsLogsPagination', meta);
      if (!context.state.statusAll.length) {
        await context.dispatch('loadStatusAll');
      }
      context.commit('setIsStatusHistoryDetailsLoaded', true);
    } catch (e) {
      context.commit('app/setProgressBar', 'stop', { root: true });
      toast.error(e.message);
      throw e;
    }
  },

  async loadServerMonitoring(context) {
    try {
      const { data } = await MonitoringService.getServerMonitoring(
        context.rootGetters['auth/accessToken'],
      );
      const { result } = data;
      context.commit('setServerMonitoringDisk', result.disk);
      context.commit('setServerMonitoringQueues', result.queues);
    } catch (e) {
      toast.error(e.message);
      throw e;
    }
  },
};

export const monitoring: Module<MonitoringState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
