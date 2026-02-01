import { useState, useMemo } from "react"
import { useProposalsList } from "@/hooks/proposals/useProposalsList"
import { useProposalStore } from "@/stores/proposalStore"
import ProposalPreviewCard from "@/components/proposals/ProposalPreviewCard"

const ITEMS_PER_PAGE = 6

function ProposalsList() {
  const { error } = useProposalsList() // Only for initial load
  const proposals = useProposalStore((s) => s.proposals) // Real-time updates
  const loading = useProposalStore((s) => s.loading)
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const totalPages = Math.ceil(proposals.length / ITEMS_PER_PAGE)
  
  // Ensure current page is valid (compute valid page - no setState needed)
  const validPage = useMemo(() => {
    if (totalPages === 0) return 1
    return currentPage > totalPages ? 1 : currentPage
  }, [currentPage, totalPages])

  const paginatedProposals = useMemo(() => {
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return proposals.slice(startIndex, endIndex)
  }, [proposals, validPage])

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

  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    const safePage = page > totalPages ? 1 : page
    setCurrentPage(safePage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="proposals-list">
        {paginatedProposals.map(p => (
          <ProposalPreviewCard key={p.id} proposal={p}/>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`pagination-page ${validPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="pagination-ellipsis">...</span>
              }
              return null
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default ProposalsList
