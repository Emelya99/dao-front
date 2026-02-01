import { TProposalVote } from '@/types/proposal'
import { formatTokenAmount } from '@/utils/formatToken'
import EtherscanLink from '@/components/ui/EtherscanLink'
import { WalletAvatar } from '@/components/wallet/WalletAvatar'

type Props = {
  votes: TProposalVote[]
  loading: boolean
  error: string | null
}

function ProposalVotesTable({ votes, loading, error }: Props) {
  if (loading) {
    return (
      <section>
        <h3>Votes ({votes.length || 0})</h3>
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p>Loading votes...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h3>Votes</h3>
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: 'var(--danger-red)' }}>⚠️</div>
          <p style={{ color: 'var(--danger-red)' }}>Error loading votes: {error}</p>
        </div>
      </section>
    )
  }

  if (!votes || votes.length === 0) {
    return (
      <section>
        <h3>Votes</h3>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h4 style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '8px' }}>
            No votes cast yet
          </h4>
          <p>Be the first to vote on this proposal!</p>
        </div>
      </section>
    )
  }

  // Sort votes: For first, then Against, both sorted by amount (descending)
  const sortedVotes = [...votes].sort((a, b) => {
    if (a.support !== b.support) {
      return a.support ? -1 : 1 // For votes first
    }
    return b.amount - a.amount // Higher amount first
  })

  return (
    <section>
      <h3>Votes ({votes.length})</h3>
      
      <div className="votes-list">
        {sortedVotes.map((vote, index) => (
          <div key={`${vote.voter}-${vote.transactionHash}-${index}`} className="vote-item">
            <div className="vote-item-header">
              <div className="vote-voter-info">
                <WalletAvatar address={vote.voter} />
                <div className="vote-voter-details">
                  <EtherscanLink type="address" value={vote.voter}>
                    <span className="vote-voter-address">
                      {vote.voter.slice(0, 6)}...{vote.voter.slice(-4)}
                    </span>
                  </EtherscanLink>
                  <span className="vote-time">
                    {new Date(vote.timestamp).toLocaleDateString()} {new Date(vote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <span className={`vote-badge ${vote.support ? 'vote-for' : 'vote-against'}`}>
                {vote.support ? '✓ For' : '✗ Against'}
              </span>
            </div>
            
            <div className="vote-item-body">
              <div className="vote-amount-section">
                <div className="vote-amount-label">Voting Power</div>
                <div className="vote-amount-value">{formatTokenAmount(vote.amount)}</div>
              </div>
              
              <div className="vote-meta-grid">
                <div className="vote-meta-item">
                  <div className="vote-meta-label">Block</div>
                  <EtherscanLink type="block" value={String(vote.blockNumber)}>
                    <div className="vote-meta-value">#{vote.blockNumber}</div>
                  </EtherscanLink>
                </div>
                <div className="vote-meta-item">
                  <div className="vote-meta-label">Transaction</div>
                  <EtherscanLink type="tx" value={vote.transactionHash}>
                    <div className="vote-meta-value">View TX →</div>
                  </EtherscanLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProposalVotesTable
