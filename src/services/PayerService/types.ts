export interface PayerStore {
  id: string;
  name: string;
  status: number;
  staticAddress: number;
  returnUrl: string | null;
  siteUrl: string | null;
}

export interface PayerTransaction {
  amount: string;
  amount_usd: string;
  bandwidth: unknown;
  created_at: string;
  currency_id: string;
  energy: unknown;
  fee: string;
  from_address: string;
  id: string;
  invoice_id: string;
  network_created_at: string;
  rate: string;
  store_id: string;
  to_address: string;
  tx_id: string;
  type: string;
  updated_at: string;
  user_id: string;
  withdrawal_is_manual: boolean;
}

export interface PayerAddress {
  blockchain: string;
  currency: string;
  address: string;
  transactions: PayerTransaction[];
  unconfirmedTransactions: PayerTransaction[];
}

export interface PayerResponse {
  id: string;
  store_id: string;
  store_user_id: string;
  store: PayerStore;
  address: PayerAddress[];
  currency: string[];
}
