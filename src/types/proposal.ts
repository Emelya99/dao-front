import { TAddress, TWei, THex } from "@/types/web3"

export type TProposalAction =
  | "NOOP"
  | "UPDATE_MIN_TOKENS"
  | "UPDATE_VOTING_PERIOD"
  | "MINT_TOKENS"
  | "CUSTOM_CALLDATA"

export type TProposalExecutionData = {
  target: TAddress
  value: TWei
  calldata: THex
}

export type TProposalFormState = {
  description: string
  actionType: TProposalAction
  params: TProposalExecutionData
}