import { api } from '@/api/Api';
import { AxiosBaseResponse } from '@/api/types';

export default class PayerService {
  public static async getPayer(payerId: string): Promise<AxiosBaseResponse<any>> {
    return api.get(`payer/${payerId}`);
  }

  public static async getAddress(payerId: string, currencyId: string): Promise<AxiosBaseResponse<any>> {
    return api.get(`payer/${payerId}/addresses/${currencyId}`);
  }
}
