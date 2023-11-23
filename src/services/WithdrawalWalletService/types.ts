export interface WithdrawalWallerResponse  {
    chain: string,
    blockchain: string,
    currency: string,
    withdrawalEnabled: number,
    withdrawalMinBalance: number,
    withdrawalInterval: null,
    address: Array<string>
}