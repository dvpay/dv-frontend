export interface StoreListResponse {
  id: string;
  name: string;
  createdAt: string;
  invoicesAmount: number | string | null;
  invoicesCount: number;
}

export interface CreateStoreRequest {
  name: string;
}

export interface StoreResponse {
  id: string;
  name: string;
  site: string | null;
  currency: string;
  rateSource: string;
  invoiceExpirationTime: null | number;
  addressHoldTime: null | number;
  acceptPaymentAtActualRate: boolean;
  status: number;
  staticAddresses: number;
  minimalPayment: number;
}

export interface UpdateStoreRequest {
  name: string;
  site: string | null;
  currency: string;
  invoiceExpirationTime: null | number;
  rateSource?: string;
  minimalPayment: number;
}

export interface UpdateRateSourceRequest {
  rateSource: string;
}

export interface ApiKeysResponse {
  id: string;
  storeId: string;
  key: string;
  enabled: boolean;
}

export interface ApiKeyUpdateRequest {
  enabled: boolean;
}

export interface WebhookResponse {
  id?: string;
  url: string;
  secret: string;
  enabled: number;
  events: string[];
}

export type WebhookCreateRequest = WebhookResponse;

export interface TestWebhookRequest {
  eventType: string;
  orderId: string;
}

export interface TestWebhookResponse {
  status: number;
  message: string;
}

export interface ReturnUrl {
  return_url: string | null;
  success_url: string | null;
}
