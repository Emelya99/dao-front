import { useReadContract } from 'wagmi'
import { TProposalDetail } from '@/types/proposal'
import { CONTRACTS, getContractAbi } from '@/contracts'
import { QUORUM_PERCENTAGE } from '@/constants'
import { TAddress } from '@/types/web3'

type CanExecuteResult = {
  canExecute: boolean
  reason?: string
  loading: boolean
}

export function useCanExecute(
  proposal: TProposalDetail | undefined,
  isExpired: boolean
): CanExecuteResult {
  // Read executed status from ProposalContract
  const { data: executed, isLoading } = useReadContract({
    address: proposal?.proposalContract as TAddress,
    abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
    functionName: 'executed',
    query: {
      enabled: !!proposal,
    },
  })

  // Check all conditions
  if (!proposal) {
    return { canExecute: false, reason: 'Proposal not found', loading: false }
  }

  if (isLoading) {
    return { canExecute: false, reason: 'Checking...', loading: true }
  }

  if (executed === true) {
    return { canExecute: false, reason: 'Proposal already executed', loading: false }
  }

  if (!isExpired) {
    return { canExecute: false, reason: 'Voting period is still active', loading: false }
  }

  // Check quorum
  const totalVotes = proposal.voteCountFor + proposal.voteCountAgainst
  if (totalVotes === 0) {
    return { canExecute: false, reason: 'No votes cast for this proposal', loading: false }
  }

  const forPercentage = totalVotes > 0 
    ? Math.round((proposal.voteCountFor / totalVotes) * 100) 
    : 0

  if (forPercentage < QUORUM_PERCENTAGE) {
    return { canExecute: false, reason: `Quorum not reached (${forPercentage}% < ${QUORUM_PERCENTAGE}%)`, loading: false }
  }

  return { canExecute: true, loading: false }
}

