import { create } from 'zustand'
import { TProposalPreview } from '@/types/proposal'

type ProposalState = {
  proposals: TProposalPreview[]
  loading: boolean
  
  setProposals: (proposals: TProposalPreview[]) => void
  setLoading: (loading: boolean) => void
  addProposal: (proposal: TProposalPreview) => void
}

export const useProposalStore = create<ProposalState>((set) => ({
  proposals: [],
  loading: false,

  setProposals: (proposals) => set({ proposals }),
  setLoading: (loading) => set({ loading }),
  
  addProposal: (proposal) => set((state) => ({
    proposals: state.proposals.some(x => x.id === proposal.id) 
      ? state.proposals 
      : [proposal, ...state.proposals]
  })),
}))
