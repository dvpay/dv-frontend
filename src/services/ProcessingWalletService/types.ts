export interface ProcessingWalletInfoResponse {
  date: string;
  count: number,
  totalEnergy: string,
  totalBandwidth: string,
}

export interface ProcessingWalletTransferResponse {
  txId: string,
  type: string,
  fromAddress: string,
  toAddress: string,
  amount: string,
  amountUsd: string,
  energy: number,
  bandwidth: number,
  createdAt: string,
}

export interface ProcessingWalletStatsResponse {
  avgTransfer: number,
  avgBandwidth: number,
  avgEnergy: number,
}
