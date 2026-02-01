import { useState } from "react"
import { TProposalAction } from "@/types/proposal"
import { useCreateProposal } from "@/hooks/proposals/useCreateProposal"

type Props = {
  onSuccess?: () => void
}

function CreateProposalForm({ onSuccess }: Props) {
    const [description, setDescription] = useState("")
    const [actionType, setActionType] = useState<TProposalAction>("NOOP")
    const [votingPeriodMinutes, setVotingPeriodMinutes] = useState<string>("")
    const [minTokens, setMinTokens] = useState<string>("")
    const { createProposal } = useCreateProposal()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Convert values based on action type
        let value = 0n
        if (actionType === "UPDATE_VOTING_PERIOD" && votingPeriodMinutes) {
            const minutes = parseInt(votingPeriodMinutes, 10)
            if (isNaN(minutes) || minutes <= 0) {
                alert("Please enter a valid voting period in minutes")
                return
            }
            value = BigInt(minutes * 60) // Convert minutes to seconds
        } else if (actionType === "UPDATE_MIN_TOKENS" && minTokens) {
            const tokens = parseFloat(minTokens)
            if (isNaN(tokens) || tokens <= 0) {
                alert("Please enter a valid minimum token amount")
                return
            }
            value = BigInt(Math.floor(tokens))
        }

        await createProposal({
            description,
            actionType,
            params: {
                target: "0x",
                value,
                calldata: "0x",
            },
        },
        {
            onSubmitted: onSuccess, 
        })
    }

    return (
        <form className="proposal-form flex-column gap-8" onSubmit={handleSubmit}>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Proposal description"
            />

            <select
                value={actionType}
                onChange={(e) => {
                    setActionType(e.target.value as TProposalAction)
                    // Reset form fields when changing action type
                    if (e.target.value !== "UPDATE_VOTING_PERIOD") {
                        setVotingPeriodMinutes("")
                    }
                    if (e.target.value !== "UPDATE_MIN_TOKENS") {
                        setMinTokens("")
                    }
                }}
            >
                <option value="NOOP">Discussion proposal</option>
                <option value="UPDATE_MIN_TOKENS">Update min tokens</option>
                <option value="UPDATE_VOTING_PERIOD">Update voting period</option>
                <option value="MINT_TOKENS" disabled>Mint tokens</option>
                <option value="CUSTOM_CALLDATA" disabled>Custom calldata</option>
            </select>

            {actionType === "UPDATE_VOTING_PERIOD" && (
                <input
                    type="number"
                    value={votingPeriodMinutes}
                    onChange={(e) => setVotingPeriodMinutes(e.target.value)}
                    placeholder="Voting period (minutes)"
                    min="1"
                    required
                />
            )}

            {actionType === "UPDATE_MIN_TOKENS" && (
                <input
                    type="number"
                    value={minTokens}
                    onChange={(e) => setMinTokens(e.target.value)}
                    placeholder="Minimum tokens to create proposal"
                    min="100"
                    step="10"
                    required
                />
            )}

            <button 
                type="submit" 
                disabled={
                    !description || 
                    (actionType === "UPDATE_VOTING_PERIOD" && !votingPeriodMinutes) ||
                    (actionType === "UPDATE_MIN_TOKENS" && !minTokens)
                }
            >
                Create
            </button>
        </form>
    )
}

export default CreateProposalForm