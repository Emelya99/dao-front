import { useEffect, useState } from 'react'
import { fetchProposals } from '@/services/proposalApi'
import { useProposalStore } from '@/stores/proposalStore'

export function useProposalsList() {
  const [error, setError] = useState<string | null>(null)
  
  const proposals = useProposalStore((s) => s.proposals)
  const setProposals = useProposalStore((s) => s.setProposals)
  const setLoading = useProposalStore((s) => s.setLoading)

  useEffect(() => {
    async function loadProposals() {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchProposals()
        // Reverse to show newest first (backend returns oldest first)
        setProposals(data.proposals.reverse())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load proposals')
      } finally {
        setLoading(false)
      }
    }

    loadProposals()
  }, [setProposals, setLoading])

  return {
    proposals,
    error,
  }
}

