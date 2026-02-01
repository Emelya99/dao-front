import { getProposalStatus } from '@/utils/proposalHelpers'

type Props = {
  proposalId: number
  executed: boolean
  isExpired: boolean
}

function ProposalHeader({ proposalId, executed, isExpired }: Props) {
  const status = getProposalStatus(executed, isExpired)

  const getStatusClass = () => {
    if (executed) return 'status-executed'
    if (isExpired) return 'status-expired'
    return 'status-active'
  }

  const getStatusIcon = () => {
    if (executed) return '✓'
    if (isExpired) return '⏱'
    return '●'
  }

  return (
    <div className="proposal-header-section flex-between-center gap-8">
      <h1 className="proposal-id mb-0">Proposal #{proposalId}</h1>
      <span className={`proposal-status ${getStatusClass()}`}>
        {getStatusIcon()} {status}
      </span>
    </div>
  )
}

export default ProposalHeader

