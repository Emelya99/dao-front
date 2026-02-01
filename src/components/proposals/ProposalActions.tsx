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
      
      {/* Execute button */}
      {shouldHideExecuteButton ? (
        proposal.executed ? (
          <p className="vote-status-message">
            Proposal already executed
          </p>
        ) : hasPendingExecution(proposal.id) ? (
          <p className="vote-status-message">
            Execution submitted, waiting for confirmation...
          </p>
        ) : null
      ) : (
        <>
          {!canExecute && executeDisabledReason && (
            <p className="vote-status-message">{executeDisabledReason}</p>
          )}
          
          <div className="action-buttons">
            <button 
              disabled={!canExecute || checkingExecute || isExecuteTransactionPending}
              onClick={handleExecute}
            >
              {isExecuteTransactionPending ? 'Executing...' : checkingExecute ? 'Checking...' : 'Execute Proposal'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default ProposalActions

