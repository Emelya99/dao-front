import { useState } from "react"
import { TProposalAction } from "@/types/proposal"
import { useCreateProposal } from "@/hooks/useCreateProposal"

type Props = {
  onSuccess?: () => void
}

function CreateProposalForm({ onSuccess }: Props) {
    const [description, setDescription] = useState("")
    const [actionType, setActionType] = useState<TProposalAction>("NOOP")
    const { createProposal } = useCreateProposal()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        await createProposal({
            description,
            actionType,
            params: {
                target: "0x",
                value: 0n,
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
                onChange={(e) => setActionType(e.target.value as TProposalAction)}
            >
                <option value="NOOP">Discussion proposal</option>
                <option value="UPDATE_MIN_TOKENS" disabled>Update min tokens</option>
                <option value="UPDATE_VOTING_PERIOD" disabled>Update voting period</option>
                <option value="MINT_TOKENS" disabled>Mint tokens</option>
                <option value="CUSTOM_CALLDATA" disabled>Custom calldata</option>
            </select>

            <button type="submit" disabled={!description}>
                Create
            </button>
        </form>
    )
}

export default CreateProposalForm