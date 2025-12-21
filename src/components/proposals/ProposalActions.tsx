import { useCanVote } from '@/hooks/proposals/useCanVote'
import { useVote } from '@/hooks/proposals/useVote'
import { TProposalDetail } from '@/types/proposal'

type Props = {
  proposal: TProposalDetail
  isExpired: boolean
}

function ProposalActions({ proposal, isExpired }: Props) {
  const { vote, isPending, isVoting, hasPendingVote, hasConfirmedVote } = useVote()
  const { canVote, reason: voteDisabledReason, loading: checkingVote } = useCanVote(proposal, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired
  })

  const isTransactionPending = isPending || isVoting || hasPendingVote(proposal.id)
  const shouldHideVoteButtons = hasConfirmedVote(proposal.id) || voteDisabledReason === 'You already voted'

  const handleVote = async (support: boolean) => {
    try {
      await vote({
        proposalContract: proposal.proposalContract,
        proposalId: proposal.id,
        support,
      })
    } catch (err) {
      // Error already handled in useVote hook
    }
  }

  return (
    <section className="proposal-section">
      <h3>Actions</h3>
      
      {/* Hide vote buttons if vote is confirmed or user already voted */}
      {shouldHideVoteButtons ? (
        <p className="vote-status-message">
          You already voted on this proposal
        </p>
      ) : hasPendingVote(proposal.id) ? (
        <p className="vote-status-message">
          Vote submitted, waiting for confirmation...
        </p>
      ) : (
        <>
          {!canVote && voteDisabledReason && (
            <p className="vote-status-message">{voteDisabledReason}</p>
          )}
          
          <div className="action-buttons">
            <button 
              disabled={!canVote || checkingVote || isTransactionPending}
              onClick={() => handleVote(true)}
            >
              {isTransactionPending ? 'Voting...' : checkingVote ? 'Checking...' : 'Vote For'}
            </button>
            <button 
              disabled={!canVote || checkingVote || isTransactionPending}
              onClick={() => handleVote(false)}
            >
              {isTransactionPending ? 'Voting...' : checkingVote ? 'Checking...' : 'Vote Against'}
            </button>
          </div>
        </>
      )}
      
      <div className="action-buttons">
        <button disabled>
          Execute (Coming Soon)
        </button>
      </div>
    </section>
  )
}

export default ProposalActions

