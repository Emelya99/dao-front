// Route paths
export const ROUTES = {
  HOME: '/',
  PROPOSAL_DETAIL: '/proposals/:id',
} as const

// Route generators
export const getProposalDetailPath = (id: number | string) => `/proposals/${id}`

