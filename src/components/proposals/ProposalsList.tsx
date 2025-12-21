import { useProposalsList } from "@/hooks/proposals/useProposalsList"
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
    <ul className="flex-column gap-12">
      {proposals.map(p => (
        <li key={p.id}>
          <ProposalPreviewCard proposal={p}/>
        </li>
      ))}
    </ul>
  )
}

export default ProposalsList
