export type UserRoleType = 'root' | 'admin' | 'support';

export interface UserInfoResponse {
  email: string;
  roles: UserRoleType[];
  telegramNotification: string;
  location: string;
  language: string;
  isEmailVerified: boolean;
  phone?: string;
  google2faSecret: null | string;
  google2faUrl: null | string;
  google2faStatus: boolean;
  permission: {
    withdrawal: boolean;
    storePay: boolean;
    stopExchange: boolean;
  }
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface VerifyEmailRequest {
  id: number;
  hash: string;
}

export interface VerifyEmailResponse {
  token: string;
}

export interface ToggleTwoFaRequest {
  status: boolean;
}

export interface ValidateTwoFaRequst {
  googleCode: string;
}
