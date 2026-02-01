import { QUORUM_PERCENTAGE } from '@/constants'
import { formatTokenAmount } from '@/utils/formatToken'
import { TProposalDetail } from '@/types/proposal'

type Props = {
  proposal: TProposalDetail
}

function ProposalVotingStats({ proposal }: Props) {
  const voteCountForFormatted = formatTokenAmount(proposal.voteCountFor)
  const voteCountAgainstFormatted = formatTokenAmount(proposal.voteCountAgainst)
  const totalVotesFormatted = formatTokenAmount(proposal.voteCountFor + proposal.voteCountAgainst)
  const totalVotes = proposal.voteCountFor + proposal.voteCountAgainst
  const forPercentage = totalVotes > 0 
    ? (proposal.voteCountFor / totalVotes) * 100
    : 0
  const againstPercentage = 100 - forPercentage
  const quorumReached = forPercentage >= QUORUM_PERCENTAGE

  return (
    <section className="voting-stats">
      <h3>Voting Results</h3>
      
      <div className="votes-grid">
        <div className="vote-stat-card for">
          <div className="vote-stat-label">Votes For</div>
          <div className="vote-stat-value">{voteCountForFormatted}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {forPercentage.toFixed(1)}%
          </div>
        </div>
        <div className="vote-stat-card against">
          <div className="vote-stat-label">Votes Against</div>
          <div className="vote-stat-value">{voteCountAgainstFormatted}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {againstPercentage.toFixed(1)}%
          </div>
        </div>
        <div className="vote-stat-card">
          <div className="vote-stat-label">Total Votes</div>
          <div className="vote-stat-value">{totalVotesFormatted}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Quorum: {quorumReached ? '✓ Reached' : '✗ Not reached'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '8px',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          <span>For: {forPercentage.toFixed(1)}%</span>
          <span>Required: {QUORUM_PERCENTAGE}%</span>
        </div>
        <div className="vote-progress-bar" style={{ height: '12px' }}>
          <div className="vote-progress-fill for" style={{ width: `${forPercentage}%` }}></div>
        </div>
      </div>
    </section>
  )
}

export default ProposalVotingStats

