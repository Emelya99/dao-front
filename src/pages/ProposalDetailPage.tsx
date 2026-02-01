import { useParams } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { useProposalDetail } from '@/hooks/proposals/useProposalDetail'
import { useProposalResults } from '@/hooks/proposals/useProposalResults'
import { useVote } from '@/hooks/proposals/useVote'
import { useProposalVotedEvent } from '@/hooks/proposals/useProposalVotedEvent'
import ProposalHeader from '@/components/proposals/ProposalHeader'
import ProposalCountdown from '@/components/proposals/ProposalCountdown'
import ProposalDescription from '@/components/proposals/ProposalDescription'
import ProposalMetadata from '@/components/proposals/ProposalMetadata'
import ProposalVotingStats from '@/components/proposals/ProposalVotingStats'
import ProposalActions from '@/components/proposals/ProposalActions'
import ProposalVotesList from '@/components/proposals/ProposalVotesList'

function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const proposalId = Number(id)
  
  const { proposal, loading, error } = useProposalDetail(proposalId)
  const { results, loading: resultsLoading, error: resultsError } = useProposalResults(proposalId)
  const { confirmVote } = useVote()
  
  // Memoize proposalContract to prevent event listener from restarting on every render
  const proposalContract = useMemo(() => proposal?.proposalContract, [proposal?.proposalContract])
  
  // Listen to Voted events for this proposal
  useProposalVotedEvent({
    proposalContract,
    proposalId,
    onVoteConfirmed: confirmVote,
  })
  
  // Track current time to check if proposal is expired (updates every second)
  const [currentTime, setCurrentTime] = useState(() => Math.floor(Date.now() / 1000))
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Calculate proposal deadline and status
  const deadline = proposal?.deadline ?? null
  const isExecuted = proposal?.executed ?? false
  const isExpired = deadline ? currentTime >= deadline : false

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

      <ProposalVotesList 
        votes={results?.votes || []}
        loading={resultsLoading}
        error={resultsError}
      />
    </div>
  )
}

export default ProposalDetailPage