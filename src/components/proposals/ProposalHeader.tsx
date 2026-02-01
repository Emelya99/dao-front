import { getProposalStatus } from '@/utils/proposalHelpers'

type Props = {
  proposalId: number
  executed: boolean
  isExpired: boolean
}

function ProposalHeader({ proposalId, executed, isExpired }: Props) {
  const status = getProposalStatus(executed, isExpired)

  return (
    <div className="proposal-header">
      <h1>Proposal #{proposalId}</h1>
      <p><strong>Status:</strong> {status}</p>
    </div>
  )
}

export default ProposalHeader

