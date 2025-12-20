import { useEffect, useState } from 'react'
import { fetchProposals } from '@/services/proposalApi'
import { useProposalStore } from '@/stores/proposalStore'

export function useProposalsList() {
  const { proposals, setProposals, setLoading } = useProposalStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProposals() {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchProposals()
        setProposals(data.proposals)
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

