// Event argument types for contract events
export interface ProposalCreatedArgs {
  id?: bigint
  creator?: string
  description?: string
  proposalAddress?: string
}

export interface ProposalExecutedArgs {
  id?: bigint
  executor?: string
}

export interface VotedArgs {
  id?: bigint
  voter?: string
  support?: boolean
}

// Base interface for event logs
export interface EventLog {
  args?: ProposalCreatedArgs | ProposalExecutedArgs | VotedArgs
  transactionHash?: string
}

