import { useAccount, useWatchContractEvent, usePublicClient } from "wagmi"
import toast from "react-hot-toast"
import { CONTRACTS, getContractInfo, getContractAbi } from "@/contracts"
import { getTxs, removePendingTx } from "@/helpers/txStorage"
import { useProposalStore } from "@/stores/proposalStore"
import { TAddress } from "@/types/web3"

const events = {
  ProposalCreated: "ProposalCreated",
  ProposalExecuted: "ProposalExecuted",
}

const errorMessages = {
  ProposalCreated: "Error watching ProposalCreated event:",
  ProposalExecuted: "Error watching ProposalExecuted event:",
}

export function EventListener() {
  const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT)
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()
  const addProposal = useProposalStore((s) => s.addProposal)
  const updateProposal = useProposalStore((s) => s.updateProposal)

  // Listen to ProposalCreated events
  useWatchContractEvent({
    address: contractInfo.address as TAddress,
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
        const txHash = log.transactionHash

        if (txHash) {
          const pendingTxs = getTxs()
          if (pendingTxs.some((t) => t.hash === txHash)) {
            removePendingTx(txHash)
          }
        }

        if (id !== undefined && creator && description && proposalAddress && txHash) {
          const proposalId = Number(id)
          
          // Add proposal with temporary deadline
          addProposal({
            id: proposalId,
            creator: creator as TAddress,
            description: description as string,
            proposalContract: proposalAddress as TAddress,
            executed: false,
            deadline: 0,
            voteCountFor: 0,
            voteCountAgainst: 0,
            createdAt: new Date().toISOString(),
            transactionHash: txHash
          })

          // Read real deadline from proposal contract
          if (publicClient) {
            publicClient.readContract({
              address: proposalAddress as TAddress,
              abi: getContractAbi(CONTRACTS.PROPOSAL_CONTRACT),
              functionName: 'deadline',
            }).then((deadline) => {
              updateProposal(proposalId, { deadline: Number(deadline) })
            }).catch((err) => {
              console.error('Failed to read deadline:', err)
            })
          }

          if (userAddress && creator.toLowerCase() === userAddress.toLowerCase()) {
            toast.success(`Proposal #${proposalId} created ✅`)
          }
        }
      }
    },
  })

  // Listen to ProposalExecuted events
  useWatchContractEvent({
    address: contractInfo.address as TAddress,
    abi: contractInfo.abi,
    eventName: events.ProposalExecuted,
    enabled: true,
    onError(err: Error) {
      console.error(errorMessages.ProposalExecuted, err)
    },
    onLogs(logs) {
      for (const log of logs) {
        const id = (log as any).args?.id
        const executor = (log as any).args?.executor
        const txHash = log.transactionHash

        if (txHash) {
          const pendingTxs = getTxs()
          if (pendingTxs.some((t) => t.hash === txHash)) {
            removePendingTx(txHash)
          }
        }

        if (id !== undefined && txHash) {
          const proposalId = Number(id)
          
          // Update proposal status to executed
          updateProposal(proposalId, { executed: true })

          if (userAddress && executor && executor.toLowerCase() === userAddress.toLowerCase()) {
            toast.success(`Proposal #${proposalId} executed ✅`)
          }
        }
      }
    },
  })

  return null
}
