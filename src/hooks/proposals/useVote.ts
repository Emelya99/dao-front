import { useWriteContract, useAccount } from 'wagmi'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { CONTRACTS, getContractAbi } from '@/contracts'
import { TAddress, ErrorWithCode } from '@/types/web3'
import { savePendingTx } from '@/helpers/txStorage'
import { useProposalStore } from '@/stores/proposalStore'

type VoteParams = {
  proposalContract: TAddress
  proposalId: number
  support: boolean // true = For, false = Against
}

const TOAST = {
  SIGN: "Sign the transaction in your wallet…",
  SUBMITTED: "Transaction submitted.",
  ERROR: "Failed to vote",
}

export function useVote() {
  const { chain } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  
  // Use GLOBAL store so all components see the same state
  const addPendingVote = useProposalStore((s) => s.addPendingVote)
  const removePendingVote = useProposalStore((s) => s.removePendingVote)
  const addConfirmedVote = useProposalStore((s) => s.addConfirmedVote)

  const vote = useCallback(async ({ proposalContract, proposalId, support }: VoteParams): Promise<string> => {
    const toastId = toast.loading(TOAST.SIGN)

    try {
      const txHash = await writeContractAsync({
        address: proposalContract,
        abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
        functionName: 'vote',
        args: [support],
      })

      savePendingTx({
        hash: txHash,
        chainId: chain?.id || 0,
        tag: 'vote',
        timestamp: Date.now(),
      })

      // Mark this proposal as having a pending vote in GLOBAL store
      addPendingVote(proposalId)

      toast.success(TOAST.SUBMITTED, { id: toastId })

      return txHash
    } catch (err) {
      const error = err as ErrorWithCode
      console.error('Vote error:', error)
      
      const errorMessage = error?.shortMessage || error?.message || 'Unknown error'
      
      if (errorMessage.includes('user rejected') || errorMessage.includes('User rejected')) {
        toast.error('Transaction rejected', { id: toastId })
      } else if (errorMessage.includes('voting period has ended')) {
        toast.error('Voting period has ended', { id: toastId })
      } else if (errorMessage.includes('voter has already voted') || errorMessage.includes('already voted')) {
        toast.error('You already voted on this proposal', { id: toastId })
      } else if (errorMessage.includes('insufficient tokens')) {
        toast.error('Insufficient token balance', { id: toastId })
      } else {
        toast.error(errorMessage || TOAST.ERROR, { id: toastId })
      }
      
      throw err
    }
  }, [writeContractAsync, chain, addPendingVote])

  // Function to mark vote as confirmed (called when event is received)
  const confirmVote = useCallback((proposalId: number) => {
    removePendingVote(proposalId)
    addConfirmedVote(proposalId)
  }, [removePendingVote, addConfirmedVote])

  return {
    vote,
    isPending,
    isVoting: isPending,
    confirmVote,
  }
}

