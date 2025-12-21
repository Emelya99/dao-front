import { useWatchContractEvent, useAccount, usePublicClient } from 'wagmi'
import toast from 'react-hot-toast'
import { CONTRACTS, getContractAbi } from '@/contracts'
import { getTxs, removePendingTx } from '@/helpers/txStorage'
import { useProposalStore } from '@/stores/proposalStore'
import { TAddress } from '@/types/web3'

type Props = {
  proposalContract: TAddress | undefined
  proposalId: number
  onVoteConfirmed?: (proposalId: number) => void
}

export function useProposalVotedEvent({ proposalContract, proposalId, onVoteConfirmed }: Props) {
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()
  const updateProposal = useProposalStore((s) => s.updateProposal)

  useWatchContractEvent({
    address: proposalContract as TAddress,
    abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
    eventName: 'Voted',
    enabled: !!proposalContract,
    onError(err: Error) {
      console.error('Error watching Voted event:', err)
    },
    onLogs(logs) {
      for (const log of logs) {
        const id = (log as any).args?.id
        const voter = (log as any).args?.voter
        const support = (log as any).args?.support
        const txHash = log.transactionHash

        // Remove from pending txs
        if (txHash) {
          const pendingTxs = getTxs()
          if (pendingTxs.some((t) => t.hash === txHash)) {
            removePendingTx(txHash)
          }
        }

        if (id !== undefined && Number(id) === proposalId) {
          // Read updated vote counts from contract
          if (publicClient && proposalContract) {
            Promise.all([
              publicClient.readContract({
                address: proposalContract,
                abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
                functionName: 'voteCountFor',
              }),
              publicClient.readContract({
                address: proposalContract,
                abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
                functionName: 'voteCountAgainst',
              }),
            ])
            .then(([voteCountFor, voteCountAgainst]) => {
              updateProposal(proposalId, {
                voteCountFor: Number(voteCountFor),
                voteCountAgainst: Number(voteCountAgainst),
              })
            })
            .catch((err) => {
              console.error('Failed to read vote counts:', err)
            })
          }

          // Show success toast when event arrives (only for current user)
          if (userAddress && voter && voter.toLowerCase() === userAddress.toLowerCase()) {
            toast.success(`Vote ${support ? 'For' : 'Against'} recorded ✅`)
            // Notify that vote is confirmed (marks as confirmed, hides buttons)
            onVoteConfirmed?.(proposalId)
          }
        }
      }
    },
  })
}


