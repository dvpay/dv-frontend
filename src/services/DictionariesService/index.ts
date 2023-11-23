import { api } from '@/api/Api';
import { AxiosBaseResponse } from '@/api/types';

const urls = {
  dictionaries: '/dictionaries',
};

export default class DictionariesService {
  public static async getDictionaries(): Promise<AxiosBaseResponse<any>> {
    return api.get(urls.dictionaries);
  }
}
