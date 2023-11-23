export interface ExchangeCurrency {
  fromCurrencyId: string;
  toCurrencyId: string;
}

export interface ExchangeCurrenciesUserList {
  currencyFrom: string;
  currencyTo: string;
  ymbol: string;
}

export interface IColdWalletAddresses {
  address: string;
  chain: string;
  isWithdrawalEnabled: boolean;
  withdrawalMinBalance: number | string | null;
}

export interface WalletsResponse {
  id: string;
  address: string;
  blockchain: string;
  chain: string;
  enabled: boolean;
  minBalance: string | number;
  interval: string | number;
  enableAutomaticExchange: number;
  exchange: string;
  exchangeCurrencies: ExchangeCurrency | null;
  exchangeCurrenciesUserList: ExchangeCurrenciesUserList[] | null,
  exchangeColdWalletAddresses: null | IColdWalletAddresses[];
  exchangeColdWalletIsEnabled: boolean;
  exchangeColdWalletMinBalance: number;
  exchangeChain: string;
  withdrawalIntervalCron: string;
}

export interface WithdrawalsSettingsResponse {
  address: string;
  enabled: boolean;
  minBalance: string | number;
  interval: string | number;
  blockchain: string;
  enableAutomaticExchange: boolean | null;
  exchange: string;
  exchangeCurrencies: ExchangeCurrency[];
  exchangeColdWalletAddresses: null | IColdWalletAddresses[];
  exchangeColdWalletIsEnabled: boolean;
  exchangeColdWalletMinBalance: number;
  exchangeChain: string;
  withdrawalIntervalCron: string;
}

export type UpdateWithdrawalsSettingsRequest = WithdrawalsSettingsResponse;

export interface WalletWithdrawalsRequest {
  currencyId: string;
}

export interface WithdrawalsTransactionsResponse {
  currency: string;
  createdAt: string;
  amount: string | number;
  address: string;
  isManual: boolean;
  txId: string;
}

export interface ProcessingWalletsResponse {
  address: string;
  balance: string;
  blockchain: string;
  minBalance: string;
  bandwidth: string;
  bandwidthLimit: string;
  energy: string;
  energyLimit: string;
}

export interface WithdrawalsStatsResponse {
  today: { amountUsd: number | string; };
  yesterday: { amountUsd: number | string; };
  currentMonth: { amountUsd: number | string; };
  previousMonth: { amountUsd: number | string; };
}

export interface WithdrawalsDatesResponse {
  date: string;
  amountUsd: string;
  transactionCount: number;
}
