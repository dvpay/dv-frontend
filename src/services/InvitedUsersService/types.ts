export interface SendInviteRequest {
  email: string;
  role: string;
}

export interface AcceptInviteResponse {
  email: string;
}

export interface UpdateInvitedUserRequest {
  roles: string[];
  stores: string[];
}
