export interface TxRelatedInvoices {
  id: string;
  orderId: string;
  store: {
    id: string;
    title: string | null;
  },
  createdAt: string;
  expiredAt: string;
  amount: number;
  status: string;
}

export interface TxRelatedWebhooks {
  url: string;
  createdAt: string;
  statusCode: string;
  request: string;
  response: string | [];
}

export interface RelatedPayer {
  id: string;
  store: string;
  storeId: string;
  storeName: string;
}

export interface SearchTxResponse {
  txId: string;
  currency: string;
  blockchain: string;
  contractAddress: string;
  amount: string;
  amountUsd: string;
  rate: string;
  time: string | null;
  receiver: string;
  sender: string;
  status: string;
  relatedInvoices?: TxRelatedInvoices;
  probablyRelatedInvoices: TxRelatedInvoices[]
  relatedWebhooks?: TxRelatedWebhooks[];
  payer?: RelatedPayer;
}
