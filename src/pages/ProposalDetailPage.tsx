import { useParams } from 'react-router-dom'
import { useMemo, memo } from 'react'
import { useProposalDetail } from '@/hooks/proposals/useProposalDetail'
import { useProposalResults } from '@/hooks/proposals/useProposalResults'
import { useVote } from '@/hooks/proposals/useVote'
import { useProposalVotedEvent } from '@/hooks/proposals/useProposalVotedEvent'
import { useCountdown } from '@/hooks/useCountdown'
import ProposalHeader from '@/components/proposals/ProposalHeader'
import ProposalCountdown from '@/components/proposals/ProposalCountdown'
import ProposalDescription from '@/components/proposals/ProposalDescription'
import ProposalMetadata from '@/components/proposals/ProposalMetadata'
import ProposalVotingStats from '@/components/proposals/ProposalVotingStats'
import ProposalActions from '@/components/proposals/ProposalActions'
import ProposalVotesList from '@/components/proposals/ProposalVotesList'
import { TAddress } from '@/types/web3'

// Memoized wrapper to prevent re-renders from parent affecting event listener
const ProposalEventListener = memo(({ 
  proposalContract, 
  proposalId, 
  confirmVote 
}: { 
  proposalContract: TAddress | undefined
  proposalId: number
  confirmVote: (id: number) => void
}) => {
  useProposalVotedEvent({
    proposalContract,
    proposalId,
    onVoteConfirmed: confirmVote,
  })
  return null
})

ProposalEventListener.displayName = 'ProposalEventListener'

function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const proposalId = Number(id)
  
  const { proposal, loading, error } = useProposalDetail(proposalId)
  const { results, loading: resultsLoading, error: resultsError } = useProposalResults(proposalId)
  const { confirmVote } = useVote()
  
  // Memoize proposalContract to prevent event listener from restarting on every render
  const proposalContract = useMemo(() => proposal?.proposalContract, [proposal?.proposalContract])
  
  // Calculate proposal status (without causing re-renders)
  const deadline = proposal?.deadline ?? 0
  const isExecuted = proposal?.executed ?? false
  const { isExpired } = useCountdown(deadline)

  // Loading state
  if (loading) {
    return (
      <section className="proposal-detail">
        <p>Loading proposal...</p>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="proposal-detail">
        <h2>Error</h2>
        <p>{error}</p>
      </section>
    )
  }

  // Proposal not found state
  if (!proposal) {
    return (
      <section className="proposal-detail">
        <h2>Proposal not found</h2>
      </section>
    )
  }

  return (
    <>
      {/* Event listener isolated in memoized component */}
      <ProposalEventListener 
        proposalContract={proposalContract}
        proposalId={proposalId}
        confirmVote={confirmVote}
      />
      
      <section className="proposal-detail">
        <ProposalHeader 
          proposalId={proposal.id}
          executed={isExecuted}
          isExpired={isExpired}
        />

        <ProposalCountdown deadline={proposal.deadline} />

        <ProposalDescription description={proposal.description} />

        <ProposalMetadata proposal={proposal} />

        <ProposalVotingStats proposal={proposal} />

        <ProposalActions 
          proposal={proposal}
          isExpired={isExpired}
        />

        <ProposalVotesList 
          votes={results?.votes || []}
          loading={resultsLoading}
          error={resultsError}
        />
      </section>
    </>
  )
}

export default ProposalDetailPage