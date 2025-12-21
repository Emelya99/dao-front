import { TProposalPreview } from "@/types/proposal"
import { Link } from "react-router-dom"
import { getProposalDetailPath } from "@/constants/routes"
import { useCountdown } from "@/hooks/useCountdown"
import { getProposalStatus, formatTimeLeft } from "@/utils/proposalHelpers"
import EtherscanLink from "@/components/ui/EtherscanLink"

type Props = {
  proposal: TProposalPreview
}

function ProposalPreviewCard({ proposal }: Props) {
  const timeLeft = useCountdown(proposal.deadline ?? 0)
  const status = getProposalStatus(proposal.executed, timeLeft.isExpired)

  return (
    <div className="proposal-card">
      <h4>Proposal #{proposal.id}</h4>
      
      <div className="proposal-fields">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Time Left:</strong> {formatTimeLeft(proposal.deadline, timeLeft)}</p>
        <p><strong>Description:</strong> {proposal.description}</p>
        <p><strong>Creator:</strong> {proposal.creator}</p>
        <p>
          <strong>Contract:</strong>{" "}
          <EtherscanLink type="address" value={proposal.proposalContract} />
        </p>
        <p>
          <strong>Transaction:</strong>{" "}
          <EtherscanLink type="tx" value={proposal.transactionHash} />
        </p>
        <p><strong>Votes For:</strong> {proposal.voteCountFor}</p>
        <p><strong>Votes Against:</strong> {proposal.voteCountAgainst}</p>
        <p><strong>Deadline:</strong> {new Date(proposal.deadline * 1000).toLocaleString()}</p>
        <p><strong>Created:</strong> {new Date(proposal.createdAt).toLocaleString()}</p>
        <p><strong>Executed:</strong> {proposal.executed ? "Yes" : "No"}</p>
      </div>

      <Link to={getProposalDetailPath(proposal.id)} className="btn">
        View Details →
      </Link>
    </div>
  )
}

export default ProposalPreviewCard
