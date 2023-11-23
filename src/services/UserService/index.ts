import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import {
  UserInfoResponse,
  ChangePasswordRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ToggleTwoFaRequest,
  ValidateTwoFaRequst,
} from './types';

export default class UserService {
  public static async getUserInfo(token: Token): Promise<AxiosBaseResponse<UserInfoResponse>> {
    return api.get('/users/user', null, token);
  }

  public static async updateUserInfo(payload: Record<string, string>, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/users/user/update', payload, token);
  }

  public static async changePassword(payload: ChangePasswordRequest, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.put('/users/user/change-password', payload, token);
  }

  public static async sendEmailConfirmation(token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/users/user/resend-email-confirmation', null, token);
  }

  public static async verifyEmail(payload: VerifyEmailRequest): Promise<AxiosBaseResponse<VerifyEmailResponse>> {
    return api.post('/users/user/verify-email', payload);
  }

  public static async toggleTwoFa(payload: ToggleTwoFaRequest, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/users/user/2fa', payload, token);
  }

  public static async validateTwoFa(payload: ValidateTwoFaRequst, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/users/user/2fa/validate', payload, token);
  }
}
