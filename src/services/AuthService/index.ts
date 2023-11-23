import { api } from '@/api/Api';
import { Token, AxiosBaseResponse } from '@/api/types';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  ResetPasswordRequest,
  SetNewPasswordRequest,
} from './types';

export default class AuthService {
  public static async loginUser(payload: LoginUserRequest): Promise<AxiosBaseResponse<LoginUserResponse>> {
    return api.post('/auth/login', payload);
  }

  public static async registerUser(payload: RegisterUserRequest): Promise<AxiosBaseResponse<void>> {
    return api.post('/users/register', payload);
  }

  public static async resetPassword(payload: ResetPasswordRequest): Promise<AxiosBaseResponse<void>> {
    return api.post('/users/password/reset', payload);
  }

  public static async setNewPassword(payload: SetNewPasswordRequest): Promise<AxiosBaseResponse<any>> {
    return api.put('/users/password/set', payload);
  }

  public static async logoutUser(token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/auth/logout', null, token);
  }
}
