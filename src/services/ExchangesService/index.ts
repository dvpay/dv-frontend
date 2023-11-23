import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import {
  UserExchangesResponse,
  UserExchangesRequest,
  WalletsResponse,
  UserExchangeDirectionsRequest,
  UserExchangeDirectionsResponse,
  UpdateExchangeSettingsPayload,
  UserExchangeDirectionsBatchRequest,
} from './types';

export default class ExchangesService {
  public static async getUserExchanges(token: Token): Promise<AxiosBaseResponse<UserExchangesResponse[]>> {
    return api.get('/exchanges/keys', null, token);
  }

  public static async updateExchangeKeys(
    payload: UserExchangesRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.post('/exchanges/keys', payload, token);
  }

  public static async testExchange(
    payload: Pick<UserExchangesRequest, 'exchange'>,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.post('/exchanges/test', payload, token);
  }

  public static async getDepositWallets(
    params: Pick<UserExchangesRequest, 'exchange'>,
    token: Token,
  ): Promise<AxiosBaseResponse<WalletsResponse[]>> {
    return api.get('/exchanges/deposit/address', params, token);
  }

  public static async getWithdrawalWallets(
    params: Pick<UserExchangesRequest, 'exchange'>,
    token: Token,
  ): Promise<AxiosBaseResponse<WalletsResponse[]>> {
    return api.get('/exchanges/withdrawal/address', params, token);
  }

  public static async getAllExchangeDirections(
    params: Pick<UserExchangesRequest, 'exchange'>,
    token: Token,
  ): Promise<AxiosBaseResponse<UserExchangeDirectionsRequest>> {
    return api.get('/exchanges/symbols', params, token);
  }

  public static async getAllExchangeDirectionsSearch(
    params: Pick<UserExchangesRequest, 'exchange'>,
    token: Token,
  ): Promise<AxiosBaseResponse<UserExchangeDirectionsRequest>> {
    return api.get('/exchanges/symbols-exchange', params, token);
  }


  public static async getUserExchangeDirections(
    params: Pick<UserExchangesRequest, 'exchange'>,
    token: Token,
  ): Promise<AxiosBaseResponse<UserExchangeDirectionsResponse>> {
    return api.get('/exchanges/user-pairs', params, token);
  }

  public static async updateUserExchangeDirections(
    payload: UserExchangeDirectionsRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<any>> {
    return api.post('/exchanges/user-pairs', payload, token);
  }

  public static async batchUpdateUserExchangeDirections(
    payload: UserExchangeDirectionsBatchRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<any>> {
    return api.put('/exchanges/user-pairs', payload, token);
  }

  public static async updateExchangeSettings(
    walletId: string,
    payload: UpdateExchangeSettingsPayload,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.put(`/exchanges/${walletId}/settings`, payload, token);
  }

  public static async getColdWallets(
    params: Pick<UserExchangesRequest, 'exchange'>,
    token: Token,
  ): Promise<AxiosBaseResponse<any>> {
    return api.get('/exchanges/withdrawal/cold-wallets', params, token)
  }

  public static async createColdWallets(
    payload: Object,
    token: Token
  ): Promise<AxiosBaseResponse<any>> {
    return api.post('/exchanges/withdrawal/cold-wallets', payload, token)
  }

  public static async deleteColdWallets(
    walletId: Number,
    payload: Object,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.delete(`/exchanges/withdrawal/${walletId}/cold-wallets`, payload, token);
  }

  public static async changeStatus(
    payload: Object,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.put(`/exchanges/withdrawal/status`, payload, token);
  }
}
