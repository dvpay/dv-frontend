import { api } from '@/api/Api';
import { Token, AxiosBaseResponse } from '@/api/types';
import {
  StoreListResponse,
  CreateStoreRequest,
  StoreResponse,
  UpdateStoreRequest,
  UpdateRateSourceRequest,
  ApiKeysResponse,
  ApiKeyUpdateRequest,
  WebhookResponse,
  WebhookCreateRequest,
  TestWebhookRequest,
  TestWebhookResponse,
  ReturnUrl,
} from './types';

const urls = {
  stores: '/stores',
};

export default class StoreService {
  public static async getStores(token: Token): Promise<AxiosBaseResponse<StoreListResponse[]>> {
    return api.get(urls.stores, null, token);
  }

  public static async getStoreById(storeId: string, token: Token): Promise<AxiosBaseResponse<StoreResponse>> {
    return api.get(`${urls.stores}/${storeId}`, null, token);
  }

  public static async createStore(payload: CreateStoreRequest, token: Token): Promise<AxiosBaseResponse<StoreResponse>> {
    return api.post(urls.stores, payload, token);
  }

  public static async updateStore(storeId: string, payload: UpdateStoreRequest, token: Token): Promise<AxiosBaseResponse<StoreResponse>> {
    return api.put(`${urls.stores}/${storeId}/general`, payload, token);
  }

  public static async updateRateSource(
    storeId: string,
    payload: UpdateRateSourceRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<StoreResponse>> {
    return api.put(`${urls.stores}/${storeId}/rate-sources`, payload, token);
  }

  public static async createApiKey(storeId: string, token: Token): Promise<AxiosBaseResponse<ApiKeysResponse>> {
    return api.post(`${urls.stores}/${storeId}/api-keys`, null, token);
  }

  public static async getApiKeys(storeId: string, token: Token): Promise<AxiosBaseResponse<ApiKeysResponse[]>> {
    return api.get(`${urls.stores}/${storeId}/api-keys`, null, token);
  }

  public static async updateApiKey(
    storeId: string,
    apiKeyId: string,
    payload: ApiKeyUpdateRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<ApiKeysResponse>> {
    return api.put(`${urls.stores}/${storeId}/api-keys/${apiKeyId}`, payload, token);
  }

  public static async removeApiKey(storeId: string, apiKeyId: string, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.delete(`${urls.stores}/${storeId}/api-keys/${apiKeyId}`, null, token);
  }

  public static async getWebhooks(storeId: string, token: Token): Promise<AxiosBaseResponse<WebhookResponse[]>> {
    return api.get(`${urls.stores}/${storeId}/webhooks`, null, token);
  }

  public static async createWebhook(
    storeId: string,
    payload: WebhookCreateRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<WebhookResponse>> {
    return api.post(`${urls.stores}/${storeId}/webhooks`, payload, token);
  }

  public static async updateWebhook(
    storeId: string,
    webhookId: string,
    payload: WebhookCreateRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<WebhookResponse>> {
    return api.put(`${urls.stores}/${storeId}/webhooks/${webhookId}`, payload, token);
  }

  public static async removeWebhook(storeId: string, webhookId: string, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.delete(`${urls.stores}/${storeId}/webhooks/${webhookId}`, null, token);
  }

  public static async sendTestWebhook(
    storeId: string,
    webhookId: string,
    payload: TestWebhookRequest,
    token: Token,
  ): Promise<AxiosBaseResponse<TestWebhookResponse>> {
    return api.post(`${urls.stores}/${storeId}/webhooks/${webhookId}/test`, payload, token);
  }

  public static async getReturnUrls(storeId: string, token: Token): Promise<AxiosBaseResponse<ReturnUrl>> {
    return api.get(`${urls.stores}/${storeId}/urls`, null, token);
  }

  public static async updateReturnUrls(
    storeId: string,
    payload: ReturnUrl,
    token: Token,
  ): Promise<AxiosBaseResponse<void>> {
    return api.post(`${urls.stores}/${storeId}/urls`, payload, token);
  }

  public static dateSort<T extends StoreListResponse>(a: T, b: T): number {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }
}
