import { AxiosResponse } from 'axios';

export type Token = string | null | undefined;

export interface PaginationResponse {
  total: number;
  current_page: number;
  per_page: number;
}

export interface BaseResponse<R> {
  errors: { [key: string]: string[] };
  message: string;
  result: R;
  meta?: {
    pagination: Partial<PaginationResponse>;
  }
}

export type AxiosBaseResponse<R> = AxiosResponse<BaseResponse<R>>;
