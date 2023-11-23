import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { WithdrawalRulesResponse, WithdrawalRulesRequest } from './types';

export default class WithdrawalsService {
  public static async getWithdrawalRules(token: Token): Promise<AxiosBaseResponse<WithdrawalRulesResponse>> {
    return api.get('/withdrawal/rules', null, token);
  }

  public static async updateWithdrawalRules(payload: WithdrawalRulesRequest, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/withdrawal/rules', payload, token);
  }
}
