import { TProposalPreview } from "@/types/proposal"
import { Link } from "react-router-dom"

type Props = {
  proposal: TProposalPreview
}

function ProposalPreviewCard({ proposal }: Props) {
  const totalVotes = proposal.voteCountFor + proposal.voteCountAgainst
  const forPercentage = totalVotes > 0 
    ? Math.round((proposal.voteCountFor / totalVotes) * 100) 
    : 0

  const status = proposal.executed 
    ? "Executed" 
    : Date.now() / 1000 > proposal.deadline 
      ? "Ended" 
      : "Active"

  return (
    <Link to={`/proposals/${proposal.id}`} className="proposal-card">
      <div className="flex-between-center">
        <h4>Proposal #{proposal.id}</h4>
        <span className={`status status-${status.toLowerCase()}`}>{status}</span>
      </div>
      
      <p>{proposal.description.length > 150 
        ? proposal.description.slice(0, 150) + '...' 
        : proposal.description}
      </p>

      <div className="proposal-votes">
        <div className="votes-stats">
          <span>For: {proposal.voteCountFor}</span>
          <span>Against: {proposal.voteCountAgainst}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${forPercentage}%` }}
          />
        </div>
      </div>

      <div className="proposal-meta">
        <span>Creator: {proposal.creator.slice(0, 6)}…{proposal.creator.slice(-4)}</span>
        <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  )
}

export default ProposalPreviewCard
