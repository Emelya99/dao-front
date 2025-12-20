import { useProposalsList } from "@/hooks/useProposalsList"
import { useProposalStore } from "@/stores/proposalStore"
import ProposalPreviewCard from "@/components/proposals/ProposalPreviewCard"

function ProposalsList() {
  const { error } = useProposalsList() // Only for initial load
  const proposals = useProposalStore((s) => s.proposals) // Real-time updates
  const loading = useProposalStore((s) => s.loading)

  if (loading) return <p>Loading proposals…</p>
  if (error) return <p>Error: {error}</p>
  if (!proposals.length) return <p>No proposals yet</p>

  return (
    <div className="flex-column gap-8">
      {proposals.map(p => (
        <ProposalPreviewCard key={p.id} proposal={p} />
      ))}
    </div>
  )
}

export default ProposalsList
