export interface PayerStore {
  id: string;
  name: string;
  status: number;
  staticAddress: number;
}

export interface PayerAddress {
  blockchain: string;
  currency: string;
  address: string;
}

export interface PayerResponse {
  id: string;
  store_id: string;
  store_user_id: string;
  store: PayerStore;
  address: PayerAddress[];
  currency: string[];
}
