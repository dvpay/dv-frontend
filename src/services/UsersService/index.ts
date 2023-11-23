import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';

export default class UsersService {
  public static async getAllUsers(params: Record<string, string>, token: Token): Promise<AxiosBaseResponse<Array<Record<string, any>>>> {
    return api.get('/root/users', params, token);
  }

  public static async getUser(userId: string, token: Token): Promise<AxiosBaseResponse<Array<Record<string, any>>>> {
    return api.get(`/root/users/${userId}`, null, token);
  }

  public static async deleteUser(userId: string, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.delete(`/root/users/${userId}`, null, token);
  }

  public static async updateUserRoles(userId: string, payload: string[], token: Token): Promise<AxiosBaseResponse<void>> {
    return api.put(`/root/users/${userId}`, payload, token);
  }
}
