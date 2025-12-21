import { TProposalPreview } from "@/types/proposal"
import { Link } from "react-router-dom"
import { ETHERSCAN_BASE_URL } from "@/constants"
import { useCountdown } from "@/hooks/useCountdown"

type Props = {
  proposal: TProposalPreview
}

function ProposalPreviewCard({ proposal }: Props) {
  const timeLeft = useCountdown(proposal.deadline)
  
  const status = proposal.executed 
    ? "Executed" 
    : timeLeft.isExpired
      ? "Ended" 
      : "Active"

  const formatTimeLeft = () => {
    if (timeLeft.isExpired) return "Voting ended"
    
    const parts = []
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`)
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}h`)
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}m`)
    if (timeLeft.seconds > 0 && timeLeft.days === 0) parts.push(`${timeLeft.seconds}s`)
    
    return parts.length > 0 ? parts.join(' ') : "Less than 1s"
  }

  return (
    <div className="proposal-card">
      <h4>Proposal #{proposal.id}</h4>
      
      <div className="proposal-fields">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Time Left:</strong> {formatTimeLeft()}</p>
        <p><strong>Description:</strong> {proposal.description}</p>
        <p><strong>Creator:</strong> {proposal.creator}</p>
        <p>
          <strong>Contract:</strong>{" "}
          <a 
            href={`${ETHERSCAN_BASE_URL}/address/${proposal.proposalContract}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {proposal.proposalContract}
          </a>
        </p>
        <p>
          <strong>Transaction:</strong>{" "}
          <a 
            href={`${ETHERSCAN_BASE_URL}/tx/${proposal.transactionHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {proposal.transactionHash}
          </a>
        </p>
        <p><strong>Votes For:</strong> {proposal.voteCountFor}</p>
        <p><strong>Votes Against:</strong> {proposal.voteCountAgainst}</p>
        <p><strong>Deadline:</strong> {new Date(proposal.deadline * 1000).toLocaleString()}</p>
        <p><strong>Created:</strong> {new Date(proposal.createdAt).toLocaleString()}</p>
        <p><strong>Executed:</strong> {proposal.executed ? "Yes" : "No"}</p>
      </div>

      <Link to={`/proposals/${proposal.id}`} className="btn">
        View Details →
      </Link>
    </div>
  )
}

export default ProposalPreviewCard
