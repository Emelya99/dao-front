import { useProposals } from "@/hooks/useProposals"
import ProposalPreviewCard from "@/components/proposals/ProposalPreviewCard"

function ProposalsList() {
  const { proposals, loading } = useProposals()

  if (loading) return <p>Loading proposals…</p>
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
