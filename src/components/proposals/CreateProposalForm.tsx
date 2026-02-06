import { useState } from "react"
import { TProposalAction } from "@/types/proposal"
import { TAddress, THex } from "@/types/web3"
import { useCreateProposal } from "@/hooks/proposals/useCreateProposal"

type Props = {
  onSuccess?: () => void
}

function CreateProposalForm({ onSuccess }: Props) {
    const [description, setDescription] = useState("")
    const [actionType, setActionType] = useState<TProposalAction>("NOOP")
    const [votingPeriodMinutes, setVotingPeriodMinutes] = useState<string>("")
    const [minTokens, setMinTokens] = useState<string>("")
    const [mintAmount, setMintAmount] = useState<string>("")
    const [mintRecipient, setMintRecipient] = useState<string>("")
    const [burnAmount, setBurnAmount] = useState<string>("")
    const [customTarget, setCustomTarget] = useState<string>("")
    const [customValue, setCustomValue] = useState<string>("")
    const [customCalldata, setCustomCalldata] = useState<string>("")
    const { createProposal } = useCreateProposal()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Convert values based on action type
        let value = 0n
        let target = "0x" as TAddress

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
        } else if (actionType === "MINT_TOKENS") {
            // Validate recipient address
            if (!mintRecipient || !mintRecipient.match(/^0x[a-fA-F0-9]{40}$/)) {
                alert("Please enter a valid recipient address")
                return
            }
            // Validate and convert amount (8 decimals)
            const amount = parseFloat(mintAmount)
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid mint amount")
                return
            }
            target = mintRecipient as TAddress
            value = BigInt(Math.floor(amount * 100_000_000)) // 8 decimals
        } else if (actionType === "BURN_TOKENS") {
            // Validate and convert amount (8 decimals)
            const amount = parseFloat(burnAmount)
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid burn amount")
                return
            }
            value = BigInt(Math.floor(amount * 100_000_000)) // 8 decimals
        } else if (actionType === "CUSTOM_CALLDATA") {
            // Validate target address
            if (!customTarget || !customTarget.match(/^0x[a-fA-F0-9]{40}$/)) {
                alert("Please enter a valid target contract address")
                return
            }
            // Validate calldata format
            if (!customCalldata || !customCalldata.match(/^0x[a-fA-F0-9]*$/)) {
                alert("Please enter valid calldata (hex format starting with 0x)")
                return
            }
            // Parse ETH value (optional, defaults to 0)
            const ethValue = customValue ? parseFloat(customValue) : 0
            if (isNaN(ethValue) || ethValue < 0) {
                alert("Please enter a valid ETH value (or leave empty for 0)")
                return
            }
            target = customTarget as TAddress
            value = ethValue > 0 ? BigInt(Math.floor(ethValue * 1e18)) : 0n // Convert ETH to wei
        }

        await createProposal({
            description,
            actionType,
            params: {
                target,
                value,
                calldata: actionType === "CUSTOM_CALLDATA" ? customCalldata as THex : "0x",
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
                    if (e.target.value !== "MINT_TOKENS") {
                        setMintAmount("")
                        setMintRecipient("")
                    }
                    if (e.target.value !== "BURN_TOKENS") {
                        setBurnAmount("")
                    }
                    if (e.target.value !== "CUSTOM_CALLDATA") {
                        setCustomTarget("")
                        setCustomValue("")
                        setCustomCalldata("")
                    }
                }}
            >
                <option value="NOOP">Discussion proposal</option>
                <option value="UPDATE_MIN_TOKENS">Update min tokens</option>
                <option value="UPDATE_VOTING_PERIOD">Update voting period</option>
                <option value="MINT_TOKENS">Mint tokens</option>
                <option value="BURN_TOKENS">Burn tokens</option>
                <option value="CUSTOM_CALLDATA">Custom calldata</option>
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

            {actionType === "MINT_TOKENS" && (
                <>
                    <input
                        type="text"
                        value={mintRecipient}
                        onChange={(e) => setMintRecipient(e.target.value)}
                        placeholder="Recipient address (0x...)"
                        required
                    />
                    <input
                        type="number"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        placeholder="Amount to mint"
                        min="0"
                        step="0.00000001"
                        required
                    />
                </>
            )}

            {actionType === "BURN_TOKENS" && (
                <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="Amount to burn from DAO treasury"
                    min="0"
                    step="0.00000001"
                    required
                />
            )}

            {actionType === "CUSTOM_CALLDATA" && (
                <>
                    <input
                        type="text"
                        value={customTarget}
                        onChange={(e) => setCustomTarget(e.target.value)}
                        placeholder="Target contract address (0x...)"
                        required
                    />
                    <input
                        type="number"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        placeholder="ETH value to send (optional, default 0)"
                        min="0"
                        step="0.001"
                    />
                    <textarea
                        value={customCalldata}
                        onChange={(e) => setCustomCalldata(e.target.value)}
                        placeholder="Calldata (0x... hex format)"
                        rows={3}
                        required
                        style={{ fontFamily: "monospace", fontSize: "0.9em" }}
                    />
                </>
            )}

            <button 
                type="submit" 
                disabled={
                    !description || 
                    (actionType === "UPDATE_VOTING_PERIOD" && !votingPeriodMinutes) ||
                    (actionType === "UPDATE_MIN_TOKENS" && !minTokens) ||
                    (actionType === "MINT_TOKENS" && (!mintRecipient || !mintAmount)) ||
                    (actionType === "BURN_TOKENS" && !burnAmount) ||
                    (actionType === "CUSTOM_CALLDATA" && (!customTarget || !customCalldata))
                }
            >
                Create
            </button>
        </form>
    )
}

export default CreateProposalForm