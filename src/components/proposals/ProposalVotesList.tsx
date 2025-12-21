import { TProposalVote } from '@/types/proposal'
import { formatTokenAmount } from '@/utils/formatToken'
import EtherscanLink from '@/components/ui/EtherscanLink'

type Props = {
  votes: TProposalVote[]
  loading: boolean
  error: string | null
}

function ProposalVotesTable({ votes, loading, error }: Props) {
  if (loading) {
    return (
      <section className="proposal-section">
        <h3>Votes List</h3>
        <p>Loading votes...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="proposal-section">
        <h3>Votes List</h3>
        <p className="error-text">Error loading votes: {error}</p>
      </section>
    )
  }

  if (!votes || votes.length === 0) {
    return (
      <section className="proposal-section">
        <h3>Votes List</h3>
        <p>No votes cast yet</p>
      </section>
    )
  }

  return (
    <section className="proposal-section">
      <h3>Votes List ({votes.length})</h3>
      
      <ul className="votes-list flex-column gap-12">
        {votes.map((vote, index) => (
          <li key={`${vote.voter}-${vote.transactionHash}-${index}`}>
            <div className="vote-card">
              <div className="vote-card-header flex-between-center">
                <div className="vote-voter">
                  <EtherscanLink type="address" value={vote.voter}>
                    { vote.voter }
                  </EtherscanLink>
                </div>
                <span className={`vote-badge ${vote.support ? 'vote-for' : 'vote-against'}`}>
                  {vote.support ? '✓ For' : '✗ Against'}
                </span>
              </div>
              
              <div className="vote-card-body">
                <div className="vote-info-row">
                  <span className="vote-label">Amount:</span>
                  <span className="vote-value">{formatTokenAmount(vote.amount)}</span>
                </div>
                
                <div className="vote-info-row">
                  <span className="vote-label">Block:</span>
                  <EtherscanLink type="block" value={String(vote.blockNumber)}>
                    <span className="vote-value">{vote.blockNumber}</span>
                  </EtherscanLink>
                </div>
                
                <div className="vote-info-row">
                  <span className="vote-label">Time:</span>
                  <span className="vote-value">{new Date(vote.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="vote-card-footer">
                <EtherscanLink type="tx" value={vote.transactionHash}>
                  View Transaction →
                </EtherscanLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProposalVotesTable
