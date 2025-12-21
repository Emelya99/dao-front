import { useParams } from 'react-router-dom'
import { useProposalDetail } from '@/hooks/proposals/useProposalDetail'
import { useCountdown } from '@/hooks/useCountdown'
import { QUORUM_PERCENTAGE } from '@/constants'
import { getProposalStatus, formatTimeLeft } from '@/utils/proposalHelpers'
import EtherscanLink from '@/components/ui/EtherscanLink'

function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const proposalId = Number(id)
  
  const { proposal, loading, error } = useProposalDetail(proposalId)
  const timeLeft = useCountdown(proposal?.deadline ?? 0)

  if (loading) {
    return (
      <div className="proposal-detail">
        <p>Loading proposal...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="proposal-detail">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="proposal-detail">
        <h2>Proposal not found</h2>
      </div>
    )
  }

  const status = getProposalStatus(proposal.executed, timeLeft.isExpired)

  const totalVotes = proposal.voteCountFor + proposal.voteCountAgainst
  const forPercentage = totalVotes > 0 
    ? Math.round((proposal.voteCountFor / totalVotes) * 100) 
    : 0
  const quorumReached = forPercentage >= QUORUM_PERCENTAGE

  return (
    <div className="proposal-detail">
      {/* Header */}
      <div className="proposal-header">
        <h1>Proposal #{proposal.id}</h1>
        <span className={`status status-${status.toLowerCase()}`}>{status}</span>
      </div>

      {/* Countdown */}
      <div className="proposal-countdown">
        <strong>Time Left:</strong> {formatTimeLeft(proposal.deadline, timeLeft)}
      </div>

      {/* Description */}
      <section className="proposal-section">
        <h3>Description</h3>
        <p>{proposal.description}</p>
      </section>

      {/* Metadata */}
      <section className="proposal-section">
        <h3>Metadata</h3>
        <div className="metadata-grid">
          <div>
            <strong>Creator:</strong> {proposal.creator}
          </div>
          <div>
            <strong>Proposal Contract:</strong>{" "}
            <EtherscanLink type="address" value={proposal.proposalContract} />
          </div>
          <div>
            <strong>Transaction:</strong>{" "}
            <EtherscanLink type="tx" value={proposal.transactionHash} />
          </div>
          <div>
            <strong>Created:</strong> {new Date(proposal.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Deadline:</strong>{" "}
            {proposal.deadline 
              ? new Date(proposal.deadline * 1000).toLocaleString()
              : "Loading..."
            }
          </div>
          {proposal.executedAt && (
            <div>
              <strong>Executed:</strong> {new Date(proposal.executedAt).toLocaleString()}
            </div>
          )}
          <div>
            <strong>Start Block:</strong> {proposal.startBlock}
          </div>
          {proposal.endBlock && (
            <div>
              <strong>End Block:</strong> {proposal.endBlock}
            </div>
          )}
        </div>
      </section>

      {/* Voting Stats */}
      <section className="proposal-section">
        <h3>Voting Results</h3>
        
        <div className="voting-stats">
          <div className="vote-counts">
            <div className="vote-count vote-for">
              <span className="label">For:</span>
              <span className="value">{proposal.voteCountFor}</span>
            </div>
            <div className="vote-count vote-against">
              <span className="label">Against:</span>
              <span className="value">{proposal.voteCountAgainst}</span>
            </div>
            <div className="vote-count vote-total">
              <span className="label">Total:</span>
              <span className="value">{totalVotes}</span>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-label">
              <span>For: {forPercentage}%</span>
              <span>Quorum: {QUORUM_PERCENTAGE}% {quorumReached ? "✅" : "❌"}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${forPercentage}%` }}
              />
              <div 
                className="progress-bar-quorum" 
                style={{ left: `${QUORUM_PERCENTAGE}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons (placeholders) */}
      <section className="proposal-section">
        <h3>Actions</h3>
        <div className="action-buttons">
          <button className="btn btn-primary" disabled>
            Vote For (Coming Soon)
          </button>
          <button className="btn btn-secondary" disabled>
            Vote Against (Coming Soon)
          </button>
          <button className="btn btn-success" disabled>
            Execute (Coming Soon)
          </button>
        </div>
      </section>

      {/* Results Table Placeholder */}
      <section className="proposal-section">
        <h3>Votes List</h3>
        <p className="placeholder-text">Votes table coming soon...</p>
      </section>
    </div>
  )
}

export default ProposalDetailPage

