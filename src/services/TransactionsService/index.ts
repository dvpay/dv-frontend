import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import { SearchTxResponse } from './types';

export default class TransactionsService {
  public static async searchTransaction(transactionId: string, token: Token): Promise<AxiosBaseResponse<SearchTxResponse>> {
    return api.get(`/support/transactions/${transactionId}`, null, token);
  }

  public static async reSendWebhook(invoiceId: string, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post(`/support/invoices/${invoiceId}/webhook`, null, token);
  }

  public static async attachInvoice(transactionId: string, invoiceId: string, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post(`/support/transactions/${transactionId}/invoices/${invoiceId}`, null, token);
  }

  public static async attachTransactionToPayer(transactionId: string, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post(`/support/transactions/${transactionId}/payer`, null, token);
  }

  public static async forceAttachInvoice(transactionId: string, invoiceId: string, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post(`/support/transactions/${transactionId}/invoices/${invoiceId}/force`, null, token);
  }
}
