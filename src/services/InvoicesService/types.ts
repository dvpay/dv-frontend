export interface Transactions {
  txId: string;
  linkToExplorer: string;
}

export interface InvoiceAddresses {
  address: string;
  currency: string;
  blockchain: string;
  amount: string | number;
  rate: string | number;
  leftAmount: string | number;
  leftAmountUsd: string | number;
  transactions: Transactions[];
}

export interface InvoiceResponse {
  id: string;
  returnUrl: string;
  successUrl: '',
  currency: string;
  amount: string;
  leftAmount: string;
  expiredAt: string;
  description: string;
  status: string;
  addresses: InvoiceAddresses[];
  paymentMethod: string | null;
  payerEmail: string;
  isConfirm: boolean;
  store: string;
  storeStatus: number;
}

export interface AllInvoiceAddressesResponse {
  storeId: string;
  storeName: string;
  invoiceId: string;
  address: string;
  currencyId: string;
  balance: string | number;
}

export interface AddressResponse {
  address: string;
}

export interface InvoicesResponse {
  id: string;
  storeName: string;
  orderId: string;
  createdAt: string;
  status: string;
  amount: string | number;
  currency: string;
  paymentUrl: string;
}

export interface InvoiceDetailsAddresses {
  currency: string;
  blockchain: string;
  address: string;
  rate: string | number;
  balance: string;
}

export interface InvoiceDetailsTransactions {
  currency: string;
  blockchain: string;
  tx: string;
  createdAt: string;
  amount: string;
  sender: string;
}

export interface InvoiceDetailsWebhooksHistory {
  createdAt: string;
  request: string;
  response: string;
  responseStatusCode: number;
  status: string;
  type: string;
  url: string;
}

export interface InvoiceDetailsHistory {
  createdAt: string;
  text: string;
}

export interface InvoiceDetailsResponse {
  storeName: string;
  id: string;
  storeId: string;
  status: string;
  createdAt: string;
  expiredAt: string;
  description: string;
  returnUrl: string;
  successUrl: string;
  amount: string | null;
  paidAmount: string;
  currency: string;
  addresses: InvoiceDetailsAddresses[];
  transactions: InvoiceDetailsTransactions[];
  webhookHistory: InvoiceDetailsWebhooksHistory[];
  history: InvoiceDetailsHistory[];
  ip: string | null;
  userAgent: string | null;
}

export interface CreateInvoiceRequest {
  storeId: string;
  orderId: string;
  amount: string;
  currencyCode: string;
  returnUrl?: string;
  successUrl?: string;
  description?: string;
}

export interface CreateInvoiceResponse {
  id: string;
}

export interface SendEmailRequest {
  email: string;
}
