export interface FinancialStatsResponse {
  coldWalletsUsdSum: string;
  exchangeWalletsUsdSum: string;
  unconfirmedBtcTransactions: string;
  lastSuccessfulDepositTransactionTime: string;
  lastSuccessfulWithdrawTransactionTime: string;
}
export interface SystemStatusResponse {
  name: string;
  status: string;
  statusTitle: string;
  message: string;
  ago: string;
  lastTrigger: string;
}

export interface DepositSummaryResponse {
  date: string;
  sum: string | number;
  invoiceCount: string;
  paidInvoiceCount: string;
  transactionCount: string;
}

export interface LastDepositTransactionsResponse {
  date: string;
  custom: string | null;
  description: string | null;
  storeName: string;
  amountUsd: string | number;
  amount: string | number;
  tx: string;
  explorerLink: string;
  currencyId: string;
  invoiceId: string;
}


