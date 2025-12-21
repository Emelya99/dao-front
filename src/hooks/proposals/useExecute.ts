import { useWriteContract, useAccount } from 'wagmi'
import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { CONTRACTS, getContractInfo } from '@/contracts'
import { savePendingTx } from '@/helpers/txStorage'

type ExecuteParams = {
  proposalId: number
}

const TOAST = {
  SIGN: "Sign the transaction in your wallet…",
  SUBMITTED: "Transaction submitted.",
  ERROR: "Failed to execute proposal",
}

export function useExecute() {
  const { chain } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT)
  // Track proposals that have pending execution (waiting for event confirmation)
  const [pendingExecutions, setPendingExecutions] = useState<Set<number>>(new Set())
  // Track proposals that have confirmed execution (event received)
  const [confirmedExecutions, setConfirmedExecutions] = useState<Set<number>>(new Set())

  const execute = useCallback(async ({ proposalId }: ExecuteParams): Promise<string> => {
    const toastId = toast.loading(TOAST.SIGN)

    try {
      const txHash = await writeContractAsync({
        address: contractInfo.address as `0x${string}`,
        abi: contractInfo.abi,
        functionName: 'executeProposal',
        args: [BigInt(proposalId)],
      })

      savePendingTx({
        hash: txHash,
        chainId: chain?.id || 0,
        tag: 'execute',
        timestamp: Date.now(),
      })

      // Mark this proposal as having a pending execution
      setPendingExecutions(prev => new Set(prev).add(proposalId))

      toast.success(TOAST.SUBMITTED, { id: toastId })

      return txHash
    } catch (err: any) {
      console.error('Execute error:', err)
      
      const errorMessage = err?.shortMessage || err?.message || 'Unknown error'
      
      if (errorMessage.includes('user rejected') || errorMessage.includes('User rejected')) {
        toast.error('Transaction rejected', { id: toastId })
      } else if (errorMessage.includes('voting period is still active')) {
        toast.error('Voting period is still active', { id: toastId })
      } else if (errorMessage.includes('proposal has already been executed') || errorMessage.includes('already been executed')) {
        toast.error('Proposal already executed', { id: toastId })
      } else if (errorMessage.includes('did not reach quorum') || errorMessage.includes('quorum')) {
        toast.error('Quorum not reached', { id: toastId })
      } else if (errorMessage.includes('no votes cast')) {
        toast.error('No votes cast for this proposal', { id: toastId })
      } else if (errorMessage.includes('execution failed')) {
        toast.error('Proposal execution failed', { id: toastId })
      } else {
        toast.error(errorMessage || TOAST.ERROR, { id: toastId })
      }
      
      throw err
    }
  }, [writeContractAsync, chain?.id, contractInfo])

  // Function to mark execution as confirmed (called when event is received)
  const confirmExecution = useCallback((proposalId: number) => {
    setPendingExecutions(prev => {
      const next = new Set(prev)
      next.delete(proposalId)
      return next
    })
    setConfirmedExecutions(prev => new Set(prev).add(proposalId))
  }, [])

  return {
    execute,
    isPending,
    isExecuting: isPending,
    hasPendingExecution: (proposalId: number) => pendingExecutions.has(proposalId),
    hasConfirmedExecution: (proposalId: number) => confirmedExecutions.has(proposalId),
    confirmExecution,
  }
}

