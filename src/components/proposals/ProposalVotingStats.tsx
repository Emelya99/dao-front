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
    ? Math.round((proposal.voteCountFor / totalVotes) * 100) 
    : 0
  const quorumReached = forPercentage >= QUORUM_PERCENTAGE

  return (
    <section className="proposal-section">
      <h3>Voting Results</h3>
      
      <div className="voting-stats">
        <div className="vote-counts">
          <div className="vote-count vote-for">
            <span className="label">For:</span>
            <span className="value">{voteCountForFormatted}</span>
          </div>
          <div className="vote-count vote-against">
            <span className="label">Against:</span>
            <span className="value">{voteCountAgainstFormatted}</span>
          </div>
          <div className="vote-count vote-total">
            <span className="label">Total:</span>
            <span className="value">{totalVotesFormatted}</span>
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
  )
}

export default ProposalVotingStats

