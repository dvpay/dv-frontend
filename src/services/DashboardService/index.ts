import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import {
  SystemStatusResponse,
  DepositSummaryResponse,
  LastDepositTransactionsResponse,
  FinancialStatsResponse,
} from './types';

export default class DashboardService {
  public static async getSystemStatus(token: Token): Promise<AxiosBaseResponse<SystemStatusResponse>> {
    return api.get('/stores/heartbeat/status', null, token);
  }

  public static async getFinancialStats(token: Token): Promise<AxiosBaseResponse<FinancialStatsResponse>> {
    return api.get('/stores/heartbeat/status/financial-stats', null, token);
  }

  public static async getDepositSummary(params: Record<string, string | string[]>, token: Token): Promise<AxiosBaseResponse<DepositSummaryResponse>> {
    return api.post('/stores/dashboard/deposit/summary', params, token);
  }

  public static async getLastDepositTransactions(
    params: Record<string, string | string[]>,
    token: Token,
  ): Promise<AxiosBaseResponse<LastDepositTransactionsResponse>> {
    return api.post('/stores/dashboard/deposit/transactions', params, token);
  }

  public static async stopOrStartAllStores(payload: Record<string, boolean>, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.put('/stores/status', payload, token);
  }

  public static async stopOrStartAllTransfers(payload: Record<string, boolean>, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/stores/wallets/withdrawals/transfer', payload, token);
  }

  public static dateSort<T extends DepositSummaryResponse>(a: T, b: T): number {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf();
  }
}
