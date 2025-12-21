import { useEffect, useState } from 'react'
import { fetchProposalResults } from '@/services/proposalApi'
import { useProposalStore } from '@/stores/proposalStore'

export function useProposalResults(id: number) {
  const { getProposalResults, setProposalResults } = useProposalStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cachedResults = getProposalResults(id)

  useEffect(() => {
    // If already cached, skip fetch
    if (cachedResults) {
      return
    }

    async function loadResults() {
      setLoading(true)
      setError(null)
      
      try {
        const results = await fetchProposalResults(id)
        setProposalResults(id, results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load results')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [id, cachedResults, setProposalResults])

  return {
    results: cachedResults,
    loading,
    error,
  }
}

