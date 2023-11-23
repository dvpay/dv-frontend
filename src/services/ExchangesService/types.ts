export interface UserExchangesResponse {
  exchange: string;
  keys: Array<{ name: string, title: string, value: string }>;
}

export type UserExchangesRequest = UserExchangesResponse;

export interface WalletsResponse {
  currency: string;
  address: string;
  chain: string;
}

export interface ExchangeDirectionsItem {
  fromCurrencyId: string;
  toCurrencyId: string;
  symbol: string;
}

export interface ExchangeDirectionsResponse {
  [key: string]: ExchangeDirectionsItem[];
}

export interface UserExchangeDirectionsResponse {
  currencyFrom: string;
  currencyTo: string;
  symbol: string;
}

export interface UserExchangeDirectionsRequest {
  exchange: string;
  currencyFrom: string;
  currencyTo: string;
  symbol: string;
}

export interface UserExchangeDirectionsBatchRequest {
  exchange: string;
  directions: UserExchangeUserPairs[]
}

export interface UserExchangeUserPairs {
  currencyFrom: string;
  currencyTo: string;
  symbol: string;
  type: string;
} 

export interface ExchangeColdWalletAddressItem {
  address: string;
  chain: string;
  withdrawalEnabled: boolean;
  withdrawalMinBalance: string;
}

export interface UpdateExchangeSettingsPayload {
  withdrawalEnabled: boolean;
  address: string;
  withdrawalMinBalance: string;
  enableAutomaticExchange: boolean;
  exchange: string;
  exchangeCurrenciesFrom: string;
  exchangeCurrenciesTo: string;
  exchangeColdWalletAddress: ExchangeColdWalletAddressItem[];
}
