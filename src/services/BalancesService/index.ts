import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { BalanceResponse } from './types';

export default class BalancesService {
  public static async getAllBalances(params: Record<string, string | string[]>, token: Token): Promise<AxiosBaseResponse<BalanceResponse>> {
    return api.post('/stores/balances', params, token);
  }
}
