import { useEffect } from 'react'
import { useCanVote } from '@/hooks/proposals/useCanVote'
import { useVote } from '@/hooks/proposals/useVote'
import { useCanExecute } from '@/hooks/proposals/useCanExecute'
import { useExecute } from '@/hooks/proposals/useExecute'
import { TProposalDetail } from '@/types/proposal'

type Props = {
  proposal: TProposalDetail
  isExpired: boolean
}

function ProposalActions({ proposal, isExpired }: Props) {
  const { vote, isPending, isVoting, hasPendingVote, hasConfirmedVote } = useVote()
  const { execute, isPending: isExecutePending, isExecuting, hasPendingExecution, hasConfirmedExecution, confirmExecution } = useExecute()
  const { canVote, reason: voteDisabledReason, loading: checkingVote } = useCanVote(proposal, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired
  })
  const { canExecute, reason: executeDisabledReason, loading: checkingExecute } = useCanExecute(proposal, isExpired)

  const isTransactionPending = isPending || isVoting || hasPendingVote(proposal.id)
  const shouldHideVoteButtons = hasConfirmedVote(proposal.id) || voteDisabledReason === 'You already voted'
  const isExecuteTransactionPending = isExecutePending || isExecuting || hasPendingExecution(proposal.id)
  const shouldHideExecuteButton = hasConfirmedExecution(proposal.id) || proposal.executed || !canExecute

  const handleVote = async (support: boolean) => {
    try {
      await vote({
        proposalContract: proposal.proposalContract,
        proposalId: proposal.id,
        support,
      })
    } catch {
      // Error already handled in useVote hook
    }
  }

  const handleExecute = async () => {
    try {
      await execute({ proposalId: proposal.id })
      // confirmExecution will be called when proposal.executed becomes true (via EventListener)
    } catch {
      // Error already handled in useExecute hook
    }
  }

  // Confirm execution when proposal.executed becomes true (event received via EventListener)
  useEffect(() => {
    if (proposal.executed && hasPendingExecution(proposal.id)) {
      confirmExecution(proposal.id)
    }
  }, [proposal.executed, proposal.id, hasPendingExecution, confirmExecution])

  return (
    <section>
      <h3>Actions</h3>
      
      {/* Vote Section */}
      {shouldHideVoteButtons ? (
        <div className="vote-status-message">
          ✓ You already voted on this proposal
        </div>
      ) : hasPendingVote(proposal.id) ? (
        <div className="vote-status-message">
          ⏳ Vote submitted, waiting for confirmation...
        </div>
      ) : (
        <>
          {!canVote && voteDisabledReason && (
            <div className="vote-status-message" style={{ borderLeftColor: 'var(--warning-orange)' }}>
              ℹ️ {voteDisabledReason}
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="btn-success"
              disabled={!canVote || checkingVote || isTransactionPending}
              onClick={() => handleVote(true)}
            >
              {isTransactionPending ? (
                <>
                  <span className="loading-spinner"></span> Voting...
                </>
              ) : checkingVote ? (
                'Checking...'
              ) : (
                '✓ Vote For'
              )}
            </button>
            <button 
              className="btn-danger"
              disabled={!canVote || checkingVote || isTransactionPending}
              onClick={() => handleVote(false)}
            >
              {isTransactionPending ? (
                <>
                  <span className="loading-spinner"></span> Voting...
                </>
              ) : checkingVote ? (
                'Checking...'
              ) : (
                '✗ Vote Against'
              )}
            </button>
          </div>
        </>
      )}
      
      {/* Execute Section */}
      {!shouldHideExecuteButton && (
        <>
          {!canExecute && executeDisabledReason && (
            <div className="vote-status-message" style={{ 
              borderLeftColor: 'var(--warning-orange)',
              marginTop: '20px'
            }}>
              ℹ️ {executeDisabledReason}
            </div>
          )}
          
          <div className="action-buttons" style={{ marginTop: '16px' }}>
            <button 
              disabled={!canExecute || checkingExecute || isExecuteTransactionPending}
              onClick={handleExecute}
            >
              {isExecuteTransactionPending ? (
                <>
                  <span className="loading-spinner"></span> Executing...
                </>
              ) : checkingExecute ? (
                'Checking...'
              ) : (
                '⚡ Execute Proposal'
              )}
            </button>
          </div>
        </>
      )}

      {proposal.executed && (
        <div className="vote-status-message" style={{ 
          borderLeftColor: 'var(--success-green)',
          background: 'var(--success-green-light)',
          marginTop: '20px'
        }}>
          ✅ Proposal has been executed
        </div>
      )}

      {hasPendingExecution(proposal.id) && !proposal.executed && (
        <div className="vote-status-message" style={{ marginTop: '20px' }}>
          ⏳ Execution submitted, waiting for confirmation...
        </div>
      )}
    </section>
  )
}

export default ProposalActions

