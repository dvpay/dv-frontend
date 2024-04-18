import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { WithdrawalWallerResponse } from './types';

export default class WithdrawalWalletService {
  public static async getWithdrawalWallets(token: Token): Promise<AxiosBaseResponse<WithdrawalWallerResponse>> {
    return api.get('/withdrawal-wallet/', null, token);
  }

  public static async getWithdrawalWallet(wallet: string, token: Token): Promise<AxiosBaseResponse<WithdrawalWallerResponse>> {
    return api.get(`/withdrawal-wallet/${wallet}`, null, token);
  }

  public static async updateWithdrawalWallet(wallet: string, payload: object, token: Token): Promise<AxiosBaseResponse<WithdrawalWallerResponse>> {
    return api.put(`/withdrawal-wallet/${wallet}`, payload, token);
  }

  public static async updateWithdrawalWalletRules(wallet: string, payload: object, token: Token): Promise<AxiosBaseResponse<WithdrawalWallerResponse>> {
    return api.put(`/withdrawal-wallet/${wallet}/withdrawal-rules`, payload, token);
  }

  public static async createWithdrawal(payload: object, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/withdrawal-wallet/withdrawal', payload, token);
  }

  public static async createWithdrawalFromAddress(payload: object, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/withdrawal-wallet/withdrawal-from-address', payload, token);
  }


}
