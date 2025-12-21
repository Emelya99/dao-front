import { useAccount, useReadContract } from 'wagmi'
import { useTokenStore } from '@/stores/tokenStore'
import { TProposalDetail } from '@/types/proposal'
import { TimeLeft } from '@/hooks/useCountdown'
import { CONTRACTS, getContractAbi } from '@/contracts'
import { TAddress } from '@/types/web3'

type CanVoteResult = {
  canVote: boolean
  reason?: string
  loading: boolean
}

export function useCanVote(
  proposal: TProposalDetail | undefined,
  timeLeft: TimeLeft
): CanVoteResult {
  const { address: userAddress, isConnected } = useAccount()
  const tokenBalance = useTokenStore((s) => s.tokenBalance)

  // Read hasVoted from ProposalContract
  const { data: hasVoted, isLoading } = useReadContract({
    address: proposal?.proposalContract as TAddress,
    abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
    functionName: 'hasVoted',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!proposal && !!userAddress && isConnected,
    },
  })

  // Check all conditions
  if (!proposal) {
    return { canVote: false, reason: 'Proposal not found', loading: false }
  }

  if (!isConnected || !userAddress) {
    return { canVote: false, reason: 'Connect wallet to vote', loading: false }
  }

  if (isLoading) {
    return { canVote: false, reason: 'Checking...', loading: true }
  }

  if (proposal.executed) {
    return { canVote: false, reason: 'Proposal already executed', loading: false }
  }

  if (timeLeft.isExpired) {
    return { canVote: false, reason: 'Voting period ended', loading: false }
  }

  if (hasVoted === true) {
    return { canVote: false, reason: 'You already voted', loading: false }
  }

  if (!tokenBalance || parseFloat(tokenBalance) === 0) {
    return { canVote: false, reason: 'Insufficient token balance', loading: false }
  }

  return { canVote: true, loading: false }
}

