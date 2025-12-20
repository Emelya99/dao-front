import { TProposalPreview } from "@/types/proposal"
import { Link } from "react-router-dom"

type Props = {
  proposal: TProposalPreview
}

function ProposalPreviewCard({ proposal }: Props) {
  return (
    <Link to={`/proposals/${proposal.id}`} className="proposal-card">
      <h4>Proposal #{proposal.id}</h4>
      <p>{proposal.description}</p>

      <div className="proposal-meta">
        <span>Creator: {proposal.creator.slice(0, 6)}…</span>
      </div>
    </Link>
  )
}

export default ProposalPreviewCard
