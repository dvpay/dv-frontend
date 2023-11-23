import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { RatesItemResponse } from './types';

export default class CurrencyService {
  public static async getRates(token: Token): Promise<AxiosBaseResponse<Record<string, RatesItemResponse>>> {
    return api.get('/stores/currencies/rates', null, token);
  }
}
