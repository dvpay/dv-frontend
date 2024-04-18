import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';

const urls = {
  dictionaries: '/dictionaries',
};

export default class DictionariesService {
  public static async getDictionaries(token: Token): Promise<AxiosBaseResponse<any>> {
    return api.get(urls.dictionaries, {}, token);
  }
}
