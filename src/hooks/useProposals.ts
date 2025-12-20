import { useProposalStore } from "@/stores/proposalStore"

export function useProposals() {
  const proposals = useProposalStore((s) => s.proposals)
  const loading = useProposalStore((s) => s.loading)

  return { proposals, loading }
}
