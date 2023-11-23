import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import {
  InvoiceAddresses,
  InvoiceResponse,
  InvoicesResponse,
  AllInvoiceAddressesResponse,
  InvoiceDetailsResponse,
  InvoiceDetailsTransactions,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  AddressResponse,
  SendEmailRequest,
} from './types';

const urls = {
  invoices: '/invoices',
};

export default class InvoicesService {
  public static async getInvoice(invoiceId: string): Promise<AxiosBaseResponse<InvoiceResponse>> {
    return api.get(`${urls.invoices}/${invoiceId}`);
  }

  public static async confirmInvoice(invoiceId: string): Promise<AxiosBaseResponse<void>> {
    return api.get(`${urls.invoices}/${invoiceId}/confirm`);
  }

  public static sendEmail(invoiceId: string, payload: SendEmailRequest): Promise<AxiosBaseResponse<void>> {
    return api.put(`${urls.invoices}/${invoiceId}`, payload);
  }

  public static async getAddress(invoiceId: string, currencyId: string): Promise<AxiosBaseResponse<AddressResponse>> {
    return api.get(`${urls.invoices}/${invoiceId}/addresses/${currencyId}`);
  }

  public static async getInvoices(params: Record<string, string | string[]>, token: Token): Promise<AxiosBaseResponse<InvoicesResponse>> {
    return api.post('/stores/invoices', params, token);
  }

  public static async getAllAddresses(
    params: Record<string, string | string[]>,
    token: Token,
  ): Promise<AxiosBaseResponse<AllInvoiceAddressesResponse>> {
    return api.post('/stores/invoices/addresses', params, token);
  }

  public static async getInvoiceDetails(invoiceId: string, token: Token): Promise<AxiosBaseResponse<InvoiceDetailsResponse>> {
    return api.get(`/stores/invoices/${invoiceId}`, null, token);
  }

  public static async createInvoice(payload: CreateInvoiceRequest, token: Token): Promise<AxiosBaseResponse<CreateInvoiceResponse>> {
    return api.post('/stores/invoices/create', payload, token);
  }

  public static currencySort(a: InvoiceAddresses, b: InvoiceAddresses) {
    return a.currency.localeCompare(b.currency);
  }

  public static dateSort<T extends InvoiceDetailsTransactions>(a: T, b: T): number {
    return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
  }

  public static rateUpdateTimer(endtime: string) {
    const total = Date.parse(endtime) - Date.parse(new Date().toString());

    if (total > 0) {
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);

      return {
        total,
        minutes: (`${minutes}`).slice(-2),
        seconds: (`0${seconds}`).slice(-2),
      };
    }

    return {
      total,
      minutes: '0',
      seconds: '00',
    };
  }

  public static invoiceTimer(endtime: string) {
    const total = Date.parse(endtime) - Date.parse(new Date().toString());

    if (total > 0) {
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      return {
        total,
        days: days.toString(),
        hours: (`0${hours}`).slice(-2),
        minutes: (`0${minutes}`).slice(-2),
        seconds: (`0${seconds}`).slice(-2),
      };
    }

    return {
      total: 0,
      days: '0',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }
}
