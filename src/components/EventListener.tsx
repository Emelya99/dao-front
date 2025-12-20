import { useAccount, useWatchContractEvent } from "wagmi"
import toast from "react-hot-toast"
import { CONTRACTS, getContractInfo } from "@/contracts"
import { getTxs, removePendingTx } from "@/helpers/txStorage"
import { useProposalStore } from "@/stores/proposalStore"
import { TAddress } from "@/types/web3"

const events = {
  ProposalCreated: "ProposalCreated",
}

const errorMessages = {
  ProposalCreated: "Error watching ProposalCreated event:",
}

export function EventListener() {
  const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT)
  const { address: userAddress } = useAccount()
  const { addProposal } = useProposalStore()

  useWatchContractEvent({
    address: contractInfo.address as `0x${string}`,
    abi: contractInfo.abi,
    eventName: events.ProposalCreated,
    enabled: true,
    onError(err: Error) {
      console.error(errorMessages.ProposalCreated, err)
    },
    onLogs(logs) {
      for (const log of logs) {
        const id = (log as any).args?.id 
        const creator = (log as any).args?.creator
        const description = (log as any).args?.description
        const proposalAddress = (log as any).args?.proposalAddress
        const deadline = (log as any).args?.deadline
        const txHash = log.transactionHash

        if (txHash) {
          const pendingTxs = getTxs()
          if (pendingTxs.some((t) => t.hash === txHash)) {
            removePendingTx(txHash)
          }
        }

        if (id !== undefined && creator && description && proposalAddress && deadline && txHash) {
          addProposal({
            id: Number(id),
            creator: creator as TAddress,
            description: description as string,
            proposalContract: proposalAddress as TAddress,
            executed: false,
            deadline: Number(deadline),
            voteCountFor: 0,
            voteCountAgainst: 0,
            createdAt: new Date().toISOString(),
            transactionHash: txHash
          })

          if (userAddress && creator.toLowerCase() === userAddress.toLowerCase()) {
            toast.success(`Proposal #${Number(id)} created ✅`)
          }
        }
      }
    },
  })

  return null
}
