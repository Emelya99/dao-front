import EtherscanLink from '@/components/ui/EtherscanLink'
import { TProposalDetail } from '@/types/proposal'

type Props = {
  proposal: TProposalDetail
}

function ProposalMetadata({ proposal }: Props) {
  return (
    <section>
      <h3>Details</h3>
      <div className="metadata-grid">
        <div className="metadata-item">
          <div className="metadata-label">Creator</div>
          <div className="metadata-value">
            <EtherscanLink type="address" value={proposal.creator} />
          </div>
        </div>
        <div className="metadata-item">
          <div className="metadata-label">Proposal Contract</div>
          <div className="metadata-value">
            <EtherscanLink type="address" value={proposal.proposalContract} />
          </div>
        </div>
        <div className="metadata-item">
          <div className="metadata-label">Creation TX</div>
          <div className="metadata-value">
            <EtherscanLink type="tx" value={proposal.transactionHash} />
          </div>
        </div>
        <div className="metadata-item">
          <div className="metadata-label">Created At</div>
          <div className="metadata-value">
            {new Date(proposal.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="metadata-item">
          <div className="metadata-label">Deadline</div>
          <div className="metadata-value">
            {proposal.deadline 
              ? new Date(proposal.deadline * 1000).toLocaleString()
              : "Loading..."
            }
          </div>
        </div>
        {proposal.executedAt && (
          <div className="metadata-item">
            <div className="metadata-label">Executed At</div>
            <div className="metadata-value">
              {new Date(proposal.executedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProposalMetadata

