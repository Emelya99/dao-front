import { http } from '@/services/http'
import { TProposalPreview, TProposalDetail, TProposalResults } from '@/types/proposal'

type ApiResponse<T> = {
  status: string
  data?: T
  message?: string
}

type ProposalsData = {
  proposals: TProposalPreview[]
  count: number
}

type ProposalDetailData = {
  proposal: TProposalDetail
}

type ProposalResultsData = {
  results: TProposalResults
}

export async function fetchProposals(): Promise<{ proposals: TProposalPreview[], count: number }> {
  const response = await http.get<ApiResponse<ProposalsData>>('/proposals')
  
  if (response.data.status !== 'ok' || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch proposals')
  }
  
  return {
    proposals: response.data.data.proposals,
    count: response.data.data.count
  }
}

export async function fetchProposalDetail(id: number): Promise<TProposalDetail> {
  const response = await http.get<ApiResponse<ProposalDetailData>>(`/proposals/${id}`)
  
  if (response.data.status !== 'ok' || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch proposal detail')
  }
  
  return response.data.data.proposal
}

export async function fetchProposalResults(id: number): Promise<TProposalResults> {
  const response = await http.get<ApiResponse<ProposalResultsData>>(`/results/${id}`)
  
  if (response.data.status !== 'ok' || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch proposal results')
  }
  
  return response.data.data.results
}

