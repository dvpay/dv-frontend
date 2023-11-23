import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import {
  StatusAllResponse,
  StatusHistoryDetailsResponse,
  ServerMonitoringResponse,
} from './types';

export default class MonitoringService {
  public static async getStatusAll(token: Token): Promise<AxiosBaseResponse<StatusAllResponse[]>> {
    return api.get('stores/heartbeat/service', null, token);
  }

  public static async getStatusHistoryDetails(
    serviceId: string,
    params: Record<string, string>,
    token: Token,
  ): Promise<AxiosBaseResponse<StatusHistoryDetailsResponse>> {
    return api.get(`stores/heartbeat/${serviceId}/launch`, params, token);
  }

  public static async getServerMonitoring(token: Token): Promise<AxiosBaseResponse<ServerMonitoringResponse>> {
    return api.get('/stores/heartbeat/monitor', null, token);
  }
}
