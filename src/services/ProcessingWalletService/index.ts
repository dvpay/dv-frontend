import { AxiosBaseResponse, Token } from '@/api/types';
import {
  ProcessingWalletInfoResponse, ProcessingWalletStatsResponse,
  ProcessingWalletTransferResponse, UpdateProcessingTransferTypeRequest,
} from '@/services/ProcessingWalletService/types';
import { api } from '@/api/Api';

export default class ProcessingWalletService {
  public static async getProcessingWalletInfo(currencyId: string, token: Token): Promise<AxiosBaseResponse<ProcessingWalletInfoResponse>> {
    return api.get(`/stores/processing/wallets/${currencyId}`, null, token);
  }

  public static async getProcessingWalletTransfer(currencyId: string, date: string, token: Token)
    : Promise<AxiosBaseResponse<ProcessingWalletTransferResponse>> {
    return api.get(`/stores/processing/wallets/${currencyId}/transfers`, {
      date,
    }, token);
  }

  public static async getProcessingWalletTransferStats(currencyId: string, token: Token)
    : Promise<AxiosBaseResponse<ProcessingWalletStatsResponse>> {
    return api.get(`/stores/processing/wallets/${currencyId}/stats`, null, token);
  }

  public static async updateProcessingTransferType(payload: UpdateProcessingTransferTypeRequest, token: Token)
    : Promise<AxiosBaseResponse<any>> {
    return api.post('/stores/processing/switch-type', payload, token);
  }
}
