import { useProposalsList } from "@/hooks/proposals/useProposalsList"
import { useProposalStore } from "@/stores/proposalStore"
import ProposalPreviewCard from "@/components/proposals/ProposalPreviewCard"

function ProposalsList() {
  const { error } = useProposalsList() // Only for initial load
  const proposals = useProposalStore((s) => s.proposals) // Real-time updates
  const loading = useProposalStore((s) => s.loading)

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <p>Loading proposals...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <p style={{ color: 'var(--danger-red)' }}>Error: {error}</p>
      </div>
    )
  }

  if (!proposals.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No proposals yet</h3>
        <p>Be the first to create a proposal!</p>
      </div>
    )
  }

  return (
    <div className="proposals-list">
      {proposals.map(p => (
        <ProposalPreviewCard key={p.id} proposal={p}/>
      ))}
    </div>
  )
}

export default ProposalsList
