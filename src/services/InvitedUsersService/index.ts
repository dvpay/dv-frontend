import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { SendInviteRequest, AcceptInviteResponse, UpdateInvitedUserRequest } from './types';

export default class InvitedUsersService {
  public static async getInvitedUsers(params: Record<string, string>, token: Token): Promise<AxiosBaseResponse<Array<Record<string, any>>>> {
    return api.get('/invite', params, token);
  }

  public static async getInvitedUser(id: string, token: Token): Promise<AxiosBaseResponse<Record<string, any>>> {
    return api.get(`/invite/${id}`, null, token);
  }

  public static async updateInvitedUser(invitedId: string, payload: UpdateInvitedUserRequest, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post(`/invite/${invitedId}`, payload, token);
  }

  public static async sendInvite(payload: SendInviteRequest, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/invite/send', payload, token);
  }

  public static async acceptInvite(payload: any): Promise<AxiosBaseResponse<AcceptInviteResponse>> {
    return api.post('/invite/accept', payload);
  }
}
