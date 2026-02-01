import { TProposalPreview } from "@/types/proposal"
import { Link } from "react-router-dom"
import { getProposalDetailPath } from "@/constants/routes"
import { useCountdown } from "@/hooks/useCountdown"
import { formatTimeLeft } from "@/utils/proposalHelpers"
import { formatTokenAmount } from "@/utils/formatToken"

type Props = {
  proposal: TProposalPreview
}

function ProposalPreviewCard({ proposal }: Props) {
  const timeLeft = useCountdown(proposal.deadline ?? 0)
  
  const totalVotes = proposal.voteCountFor + proposal.voteCountAgainst
  const forPercentage = totalVotes > 0 ? (proposal.voteCountFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (proposal.voteCountAgainst / totalVotes) * 100 : 0

  const getStatusClass = () => {
    if (proposal.executed) return 'status-executed'
    if (timeLeft.isExpired) return 'status-expired'
    return 'status-active'
  }

  return (
    <div className="proposal-card flex-column gap-12">
      <div className="proposal-header-section flex-between-center gap-4">
        <h4 className="mb-0">Proposal #{proposal.id}</h4>
        <span className={`proposal-status ${getStatusClass()}`}>
          {proposal.executed ? '✓ Executed' : timeLeft.isExpired ? '⏱ Expired' : '● Active'}
        </span>
      </div>
      
      <div className="description-section">
        <p style={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          margin: 0
        }}>
          {proposal.description}
        </p>
      </div>

      <div className="metadata-grid">
        <div className="metadata-item">
          <div className="metadata-label">Time Left</div>
          <div className="metadata-value">{formatTimeLeft(proposal.deadline, timeLeft)}</div>
        </div>
        <div className="metadata-item">
          <div className="metadata-label">Created</div>
          <div className="metadata-value">{new Date(proposal.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="vote-progress-bar">
        <div className="vote-progress-fill for" style={{ width: `${forPercentage}%` }}></div>
        <div className="vote-progress-fill against" style={{ width: `${againstPercentage}%`, marginLeft: 'auto' }}></div>
      </div>

      <div className="votes-grid">
        <div className="vote-stat-card for">
          <div className="vote-stat-label">For</div>
          <div className="vote-stat-value">{formatTokenAmount(proposal.voteCountFor)}</div>
        </div>
        <div className="vote-stat-card against">
          <div className="vote-stat-label">Against</div>
          <div className="vote-stat-value">{formatTokenAmount(proposal.voteCountAgainst)}</div>
        </div>
      </div>

      <Link to={getProposalDetailPath(proposal.id)} className="btn" style={{ marginTop: 'auto' }}>
        View Details →
      </Link>
    </div>
  )
}

export default ProposalPreviewCard
