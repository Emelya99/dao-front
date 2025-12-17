import { encodeFunctionData } from "viem"
import { CONTRACT_ABIS, CONTRACT_ADDRESSES, CONTRACTS } from "@/contracts"
import { TProposalFormState, TProposalExecutionData } from "@/types/proposal"
import { TAddress } from "@/types/web3"

export function buildExecutionData(
  form: TProposalFormState
): TProposalExecutionData {
  switch (form.actionType) {
    case "NOOP":
      return {
        target: CONTRACT_ADDRESSES[CONTRACTS.DAO_CONTRACT] as TAddress,
        value: 0n,
        calldata: encodeFunctionData({
          abi: CONTRACT_ABIS[CONTRACTS.DAO_CONTRACT],
          functionName: "noop",
          args: [],
        }),
      }

    case "UPDATE_MIN_TOKENS":
      return {
        target: CONTRACT_ADDRESSES[CONTRACTS.DAO_CONTRACT] as TAddress,
        value: 0n,
        calldata: encodeFunctionData({
          abi: CONTRACT_ABIS[CONTRACTS.DAO_CONTRACT],
          functionName: "updateMinTokensToCreateProposal",
          args: [form.params.value],
        }),
      }

    case "UPDATE_VOTING_PERIOD":
      return {
        target: CONTRACT_ADDRESSES[CONTRACTS.DAO_CONTRACT] as TAddress,
        value: 0n,
        calldata: encodeFunctionData({
          abi: CONTRACT_ABIS[CONTRACTS.DAO_CONTRACT],
          functionName: "updateVotingPeriod",
          args: [form.params.value],
        }),
      }

    case "MINT_TOKENS":
      return {
        target: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT] as TAddress,
        value: 0n,
        calldata: encodeFunctionData({
          abi: CONTRACT_ABIS[CONTRACTS.TOKEN_CONTRACT],
          functionName: "mint",
          args: [form.params.target, form.params.value],
        }),
      }

    case "CUSTOM_CALLDATA":
      return form.params

    default:
      throw new Error("Unsupported proposal action")
  }
}
