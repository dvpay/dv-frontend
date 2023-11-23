export interface ICountByStatus {
  busy: number;
  free: number;
  hold: number;
  total: number;
}

export interface Balances {
  currency: string;
  balance: string | number;
  balanceUsd: string | number;
  addressCount: ICountByStatus;
}

export interface Totals {
  amountUsd: number | string;
  addressCount: ICountByStatus;
}

export interface BalanceResponse {
  balances: Balances[];
  totals: Totals;
}
