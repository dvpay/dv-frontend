export interface WithdrawalRulesResponse {
  withdrawalIntervalCron: string | null;
  withdrawalMinBalance: number | null;
  withdrawalRuleType: string | null;
  withdrawalTypeList: string[];
}

export type WithdrawalRulesRequest = WithdrawalRulesResponse;
