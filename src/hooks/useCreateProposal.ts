import { useChainId, useWriteContract, usePublicClient } from "wagmi"
import toast from "react-hot-toast"
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, CONTRACTS } from "@/contracts"
import { TProposalFormState } from "@/types/proposal"
import { buildExecutionData } from "@/services/proposal/buildExecutionData"
import { TAddress } from "@/types/web3"
import { savePendingTx, removePendingTx } from "@/helpers/txStorage"

const TOAST = {
  SIGN: "Sign the transaction in your wallet…",
  SUBMITTED: "Transaction submitted. Waiting for confirmation…",
  CONFIRMED: "Proposal successfully created",
  ERROR: "Failed to create proposal",
}

export function useCreateProposal() {
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  async function createProposal(
    form: TProposalFormState,
    options?: { onSubmitted?: () => void }
  ): Promise<string> {
    const toastId = toast.loading(TOAST.SIGN)

    try {
      const execution = buildExecutionData(form)

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES[CONTRACTS.DAO_CONTRACT] as TAddress,
        abi: CONTRACT_ABIS[CONTRACTS.DAO_CONTRACT],
        functionName: "createProposal",
        args: [
          form.description,
          execution.target,
          execution.value,
          execution.calldata,
        ],
      })

      savePendingTx({
        hash: txHash,
        chainId,
        tag: "createProposal",
        timestamp: Date.now(),
      })

      toast.success(TOAST.SUBMITTED, { id: toastId })

      // onSubmitted
      options?.onSubmitted?.()

      // receipt check 
      if (publicClient) {
        publicClient
          .waitForTransactionReceipt({ hash: txHash })
          .then(() => {
            removePendingTx(txHash)
            toast.success(TOAST.CONFIRMED)
          })
          .catch(() => {
            // UI does not need to be updated
          })
      }

      return txHash
    } catch (e: any) {
      toast.error(e?.shortMessage || TOAST.ERROR, { id: toastId })
      throw e
    }
  }

  return { createProposal }
}