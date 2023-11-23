export interface AddressBalancesResponse {
  id: number;
  currency: string;
  address: string;
  blockchain: string;
  state: string;
  createdAt: string;
  updatedTt: string;
  transactionsPaymentSumAmount: string | null;
  transactionsPaymentSumAmountUsd: string | null;
  transactionsTransferSumAmount: string | null;
  transactionsTransferSumAmountUsd: string | null;
  balance: number | null;
  balanceUsd: number | null;
}

export interface TransferFromAddressRequest {
  addressFrom: string;
  currencyId: string;
}

export interface InvoicesByAddressStatuses {
  status: string;
  datetime: string;
}

export interface InvoicesByAddressResponse {
  id: string;
  orderId: string;
  createdAt: string;
  statuses: InvoicesByAddressStatuses[];
  amount: number;
  currency: string;
  storeName: string;
  paymentUrl: string;
}

type AddressState = 'free' | 'busy' | 'hold';

export interface DataByAddressResponse {
  address: string;
  invoices: { paid: number, total: number; };
  savedUsdOnCommission: number;
  state: AddressState;
  transactions: {
    incoming: { amountUsd: number; count: number; };
    outgoing: { amountUsd: number; count: number; };
  };
}

export interface StatsHotWalletResponse {
  addressCount: number,
  amountUsd: number,
}
