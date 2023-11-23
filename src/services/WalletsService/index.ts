import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import {
  WalletsResponse,
  WithdrawalsSettingsResponse,
  UpdateWithdrawalsSettingsRequest,
  WalletWithdrawalsRequest,
  WithdrawalsTransactionsResponse,
  ProcessingWalletsResponse,
  WithdrawalsStatsResponse,
  WithdrawalsDatesResponse,
} from './types';

const urls = {
  stores: '/stores',
  mnemonic: '/mnemonic',
  getStore(storeId: string): string {
    return `${this.stores}/${storeId}`;
  },
};

export default class WalletsService {
  public static async getWallets(token: Token): Promise<AxiosBaseResponse<WalletsResponse[]>> {
    return api.get('/stores/wallets/list', null, token);
  }

  public static async createWallets(
    token: Token,
  ): Promise<AxiosBaseResponse<WalletsResponse[]>> {
    return api.post('/stores/wallets/create', null, token);
  }

  public static async getWithdrawalsSettings(
    walletId: string,
    token: Token,
  ): Promise<AxiosBaseResponse<WithdrawalsSettingsResponse>> {
    return api.get(`/stores/wallets/${walletId}/settings`, null, token);
  }

  public static async updateWithdrawalsSettings(
    walletId: string,
    payload: UpdateWithdrawalsSettingsRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.put(`/stores/wallets/${walletId}/settings`, payload, token);
  }

  public static async withdrawalsRequest(
    payload: WalletWithdrawalsRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.post('/stores/wallets/withdrawals/create', payload, token);
  }

  public static async getWithdrawalsTransactions(
    params: Record<string, string>,
    token: Token,
  ): Promise<AxiosBaseResponse<WithdrawalsTransactionsResponse[]>> {
    return api.get('/stores/wallets/withdrawals/list', params, token);
  }

  public static async getProcessingWallets(token: Token): Promise<AxiosBaseResponse<ProcessingWalletsResponse[]>> {
    return api.get('stores/processing/wallets', null, token);
  }

  public static async generateMnemonic(): Promise<AxiosBaseResponse<string>> {
    return api.get(`${urls.mnemonic}`);
  }

  public static async getWithdrawalsStats(
    params: Record<string, string>,
    token: Token,
  ): Promise<AxiosBaseResponse<WithdrawalsStatsResponse>> {
    return api.get('/stores/wallets/withdrawals/stats', params, token);
  }

  public static async getWithdrawalsDates(
    params: Record<string, string>,
    token: Token,
  ): Promise<AxiosBaseResponse<WithdrawalsDatesResponse>> {
    return api.get('/stores/wallets/withdrawals/dates', params, token);
  }
}
