import { create } from 'zustand'
import { TProposalPreview, TProposalDetail, TProposalResults } from '@/types/proposal'

type ProposalState = {
  // List for main page
  proposals: TProposalPreview[]
  loading: boolean
  
  // Cache for detail pages
  detailCache: Record<number, TProposalDetail>
  resultsCache: Record<number, TProposalResults>
  
  // Methods for list
  setProposals: (proposals: TProposalPreview[]) => void
  setLoading: (loading: boolean) => void
  addProposal: (proposal: TProposalPreview) => void
  updateProposal: (id: number, updates: Partial<TProposalPreview>) => void
  
  // Methods for detail/results
  setProposalDetail: (id: number, detail: TProposalDetail) => void
  setProposalResults: (id: number, results: TProposalResults) => void
  getProposalDetail: (id: number) => TProposalDetail | undefined
  getProposalResults: (id: number) => TProposalResults | undefined
}

export const useProposalStore = create<ProposalState>((set, get) => ({
  proposals: [],
  loading: false,
  detailCache: {},
  resultsCache: {},

  setProposals: (proposals) => set({ proposals }),
  setLoading: (loading) => set({ loading }),
  
  addProposal: (proposal) => set((state) => ({
    proposals: state.proposals.some(x => x.id === proposal.id) 
      ? state.proposals 
      : [proposal, ...state.proposals]
  })),
  
  updateProposal: (id, updates) => set((state) => ({
    proposals: state.proposals.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  
  setProposalDetail: (id, detail) => set((state) => ({
    detailCache: { ...state.detailCache, [id]: detail }
  })),
  
  setProposalResults: (id, results) => set((state) => ({
    resultsCache: { ...state.resultsCache, [id]: results }
  })),
  
  getProposalDetail: (id) => get().detailCache[id],
  
  getProposalResults: (id) => get().resultsCache[id],
}))
