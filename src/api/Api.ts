import axios, {
  AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError,
} from 'axios';
import Cookies from 'js-cookie';
import { Token, BaseResponse } from '@/api/types';
import { CustomError } from '@/api/errors/CustomError';

const baseConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
};

export default class Api {
  private accessToken: Token;

  public axios: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    const service = axios.create(config);

    service.interceptors.request.use(
      this.requestHandleSuccess,
      this.requesteHandleError,
    );

    service.interceptors.response.use(
      this.responseHandleSuccess,
      this.responseHandleError,
    );

    this.axios = service;
  }

  protected responseHandleSuccess(response: AxiosResponse) {
    return response;
  }

  protected responseHandleError(error: AxiosError) {
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }

  protected requestHandleSuccess(config: AxiosRequestConfig) {
    config.headers = {
      ...config.headers,
      'Accept-Language': localStorage.getItem('locale') || 'en',
      'X-Requested-With': 'XMLHttpRequest',
    };
    return config;
  }

  protected requesteHandleError(error: AxiosError) {
    return Promise.reject(error);
  }

  protected getBearer(): string {
    return `Bearer ${this.accessToken}`;
  }

  protected setAccessToken(accessToken: Token): void {
    this.accessToken = accessToken;
  }

  public async request<D, R>(url: string, config: AxiosRequestConfig, token: Token): Promise<AxiosResponse<R>> {
    this.setAccessToken(token);
    try {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        url,
      };

      if (this.accessToken) {
        requestConfig.headers = {
          Authorization: this.getBearer(),
        };
      }

      return await this.axios.request<D, AxiosResponse<R>>(requestConfig);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const e = error as AxiosError<BaseResponse<R>>;

        if (e.code === 'ERR_NETWORK') {
          throw new CustomError('Network error', e.response?.status);
        }

        if (e.code === 'ECONNABORTED') {
          throw new CustomError('Timout error', e.response?.status);
        }

        if (e.response) {
          if (e.response.status === 400) {
            const message = e.response.data.errors[0].toString();
            throw new CustomError(message, e.response.status);
          }

          if (e.response.status === 404) {
            throw new CustomError('Not found', 404);
          }

          if (e.response.status === 500) {
            throw new CustomError('Server error', 500);
          }

          if (e.response.status !== 500) {
            throw new CustomError(e.response.data.message, e.response.status);
          }
        }
      }
      throw error;
    }
  }

  public async get<D, R>(
    url: string,
    params: Partial<D> | null = null,
    token: Token = '',
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<R>> {
    return this.request<D, R>(url, {
      ...config,
      method: 'GET',
      params,
    }, token);
  }

  public post<D, R>(url: string, data: Partial<D> | null = null, token: Token = '', config: AxiosRequestConfig = {}): Promise<AxiosResponse<R>> {
    return this.request<D, R>(url, {
      ...config,
      method: 'POST',
      data,
    }, token);
  }

  public delete<D, R>(url: string, data: Partial<D> | null = null, token: Token = '', config: AxiosRequestConfig = {}): Promise<AxiosResponse<R>> {
    return this.request<D, R>(url, {
      ...config,
      method: 'DELETE',
      data,
    }, token);
  }

  public put<D, R>(url: string, data: Partial<D> | null = null, token: Token = '', config: AxiosRequestConfig = {}): Promise<AxiosResponse<R>> {
    return this.request<D, R>(url, {
      ...config,
      method: 'PUT',
      data,
    }, token);
  }
}

export const api = new Api(baseConfig);
