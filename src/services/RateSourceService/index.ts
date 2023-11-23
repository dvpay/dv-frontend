import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { RateSource } from './types';

export default class RateSourceService {
  public static async getRateSource(token: Token): Promise<AxiosBaseResponse<RateSource>> {
    return api.get('/users/user/rate-source', null, token);
  }

  public static async updateRateSource(payload: RateSource, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/users/user/rate-source', payload, token);
  }
}
