import { useWatchContractEvent, useAccount, usePublicClient } from 'wagmi'
import toast from 'react-hot-toast'
import { CONTRACTS, getContractAbi } from '@/contracts'
import { getTxs, removePendingTx } from '@/helpers/txStorage'
import { useProposalStore } from '@/stores/proposalStore'
import { TAddress } from '@/types/web3'
import { EventLog, VotedArgs } from '@/types/contractEvents'

type Props = {
  proposalContract: TAddress | undefined
  proposalId: number
  onVoteConfirmed?: (proposalId: number) => void
}

export function useProposalVotedEvent({ proposalContract, proposalId, onVoteConfirmed }: Props) {
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()
  const updateProposal = useProposalStore((s) => s.updateProposal)
  const setProposalResults = useProposalStore((s) => s.setProposalResults)
  const getProposalResults = useProposalStore((s) => s.getProposalResults)

  useWatchContractEvent({
    address: proposalContract as TAddress,
    abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
    eventName: 'Voted',
    enabled: !!proposalContract,
    poll: true,
    pollingInterval: 2000,
    onError(err: Error) {
      console.error('❌ Error watching Voted event:', err)
    },
    onLogs(logs) {
      for (const log of logs) {
        const args = (log as EventLog).args as VotedArgs
        const id = args?.id
        const voter = args?.voter
        const support = args?.support
        const amount = args?.amount
        const txHash = log.transactionHash

        // Remove from pending txs
        if (txHash) {
          const pendingTxs = getTxs()
          if (pendingTxs.some((t) => t.hash === txHash)) {
            removePendingTx(txHash)
          }
        }

        if (id !== undefined && Number(id) === proposalId && voter && support !== undefined && amount && txHash && log.blockNumber) {
          // Read updated vote counts from contract and get transaction details
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
              publicClient.getBlock({ blockNumber: log.blockNumber! }),
            ])
            .then(([voteCountFor, voteCountAgainst, block]) => {
              // Update vote counts
              updateProposal(proposalId, {
                voteCountFor: Number(voteCountFor),
                voteCountAgainst: Number(voteCountAgainst),
              })
              
              // Add new vote to results cache (if exists)
              const currentResults = getProposalResults(proposalId)
              if (currentResults) {
                const newVote = {
                  voter: voter as TAddress,
                  support,
                  amount: Number(amount),
                  blockNumber: Number(log.blockNumber),
                  timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
                  transactionHash: txHash,
                }
                
                setProposalResults(proposalId, {
                  ...currentResults,
                  voteCountFor: Number(voteCountFor),
                  voteCountAgainst: Number(voteCountAgainst),
                  totalVotes: currentResults.votes.length + 1,
                  votes: [newVote, ...currentResults.votes],
                })
              }
            })
            .catch((err) => {
              console.error('Failed to read vote counts or block:', err)
            })
          }

          // Show success toast and confirm vote ONLY for current user
          if (userAddress && voter.toLowerCase() === userAddress.toLowerCase()) {
            toast.success(`Vote ${support ? 'For' : 'Against'} recorded ✅`)
            onVoteConfirmed?.(proposalId)
          }
        }
      }
    },
  })
}


