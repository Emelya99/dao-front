import { useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useProposalDetail } from '@/hooks/proposals/useProposalDetail'
import { useVote } from '@/hooks/proposals/useVote'
import { useProposalVotedEvent } from '@/hooks/proposals/useProposalVotedEvent'
import ProposalHeader from '@/components/proposals/ProposalHeader'
import ProposalCountdown from '@/components/proposals/ProposalCountdown'
import ProposalDescription from '@/components/proposals/ProposalDescription'
import ProposalMetadata from '@/components/proposals/ProposalMetadata'
import ProposalVotingStats from '@/components/proposals/ProposalVotingStats'
import ProposalActions from '@/components/proposals/ProposalActions'

function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const proposalId = Number(id)
  
  const { proposal, loading, error } = useProposalDetail(proposalId)
  const { confirmVote } = useVote()
  
  // Memoize proposalContract to prevent event listener from restarting on every render
  const proposalContract = useMemo(() => proposal?.proposalContract, [proposal?.proposalContract])
  
  // Listen to Voted events for this proposal
  useProposalVotedEvent({
    proposalContract,
    proposalId,
    onVoteConfirmed: confirmVote,
  })
  
  // Calculate proposal deadline and status
  const deadline = proposal?.deadline ?? null
  const isExecuted = proposal?.executed ?? false
  const isExpired = deadline ? Math.floor(Date.now() / 1000) >= deadline : false

  // Loading state
  if (loading) {
    return (
      <div className="proposal-detail">
        <p>Loading proposal...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="proposal-detail">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  // Proposal not found state
  if (!proposal) {
    return (
      <div className="proposal-detail">
        <h2>Proposal not found</h2>
      </div>
    )
  }

  return (
    <div className="proposal-detail">
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

      {/* Results Table Placeholder */}
      <section className="proposal-section">
        <h3>Votes List</h3>
        <p className="placeholder-text">Votes table coming soon...</p>
      </section>
    </div>
  )
}

export default ProposalDetailPage