import { TAddress, TWei, THex, THash } from "@/types/web3"

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

// Preview type for proposals list (main page) / GET /proposals
export type TProposalPreview = {
  id: number
  creator: TAddress
  description: string
  proposalContract: TAddress
  
  executed: boolean
  deadline: number // timestamp in seconds
  
  voteCountFor: number
  voteCountAgainst: number
  
  createdAt: string // ISO string
  transactionHash: THash
}

// Detail type for GET /proposals/:id (without votes)
export type TProposalDetail = TProposalPreview & {
  startBlock: number
  endBlock: number | null
  executedAt: string | null
}

// Vote record type
export type TProposalVote = {
  voter: TAddress
  support: boolean
  amount: number
  blockNumber: number
  timestamp: string // ISO string
  transactionHash: THash
}

// Results type for GET /results/:id (voting results)
export type TProposalResults = {
  proposalId: number
  voteCountFor: number
  voteCountAgainst: number
  totalVotes: number
  executed: boolean
  deadline: number // timestamp in seconds
  votes: TProposalVote[]
}