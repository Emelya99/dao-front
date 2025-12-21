import { http } from '@/services/http'
import { handleApiError } from '@/services/errorHandler'
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
  try {
    const response = await http.get<ApiResponse<ProposalsData>>('/proposals')
    
    if (response.data.status !== 'ok' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch proposals')
    }
    
    return {
      proposals: response.data.data.proposals,
      count: response.data.data.count
    }
  } catch (err) {
    handleApiError(err, 'Failed to fetch proposals')
    throw err
  }
}

export async function fetchProposalDetail(id: number): Promise<TProposalDetail> {
  try {
    const response = await http.get<ApiResponse<ProposalDetailData>>(`/proposals/${id}`)
    
    if (response.data.status !== 'ok' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch proposal detail')
    }
    
    return response.data.data.proposal
  } catch (err) {
    handleApiError(err, 'Failed to fetch proposal detail')
    throw err
  }
}

export async function fetchProposalResults(id: number): Promise<TProposalResults> {
  try {
    const response = await http.get<ApiResponse<ProposalResultsData>>(`/results/${id}`)
    
    if (response.data.status !== 'ok' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch proposal results')
    }
    
    return response.data.data.results
  } catch (err) {
    handleApiError(err, 'Failed to fetch proposal results')
    throw err
  }
}

