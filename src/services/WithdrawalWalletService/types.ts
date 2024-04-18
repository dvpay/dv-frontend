export interface WithdrawalWallerResponse {
  codeSend: string;
  chain: string,
  blockchain: string,
  currency: string,
  withdrawalEnabled: number,
  withdrawalMinBalance: number,
  withdrawalInterval: null,
  address: Array<string>
}
