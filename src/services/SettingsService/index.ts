import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { SettingsResponse } from './types';

export default class SettingsService {
  public static async getSettings(token: Token): Promise<AxiosBaseResponse<SettingsResponse[]>> {
    return api.get('/settings', null, token);
  }

  public static async updateSettings(token: Token, payload: Record<string, any>): Promise<AxiosBaseResponse<void>> {
    return api.put('/settings/update', payload, token);
  }

  public static async getIsRegistrationEnabled(): Promise<AxiosBaseResponse<SettingsResponse>> {
    return api.get('/settings/registration');
  }
}
