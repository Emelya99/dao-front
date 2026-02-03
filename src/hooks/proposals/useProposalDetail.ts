import { useEffect, useState } from 'react'
import { fetchProposalDetail } from '@/services/proposalApi'
import { useProposalStore } from '@/stores/proposalStore'
import { ApiError } from '@/types/web3'

export function useProposalDetail(id: number) {
  const setProposalDetail = useProposalStore((state) => state.setProposalDetail)
  // Subscribe to changes in store - component will re-render when data updates
  const cachedDetail = useProposalStore((state) => state.detailCache[id])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If already cached, skip fetch
    if (cachedDetail) {
      return
    }

    async function loadDetail() {
      setLoading(true)
      setError(null)
      
      try {
        const detail = await fetchProposalDetail(id)
        setProposalDetail(id, detail)
      } catch (err) {
        const error = err as ApiError
        setError(error?.response?.data?.message || 'Failed to load proposal')
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
  }, [id, cachedDetail, setProposalDetail])

  return {
    proposal: cachedDetail,
    loading,
    error,
  }
}

