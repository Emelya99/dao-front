import EtherscanLink from '@/components/ui/EtherscanLink'
import { TProposalDetail } from '@/types/proposal'

type Props = {
  proposal: TProposalDetail
}

function ProposalMetadata({ proposal }: Props) {
  return (
    <section className="proposal-section">
      <h3>Metadata</h3>
      <div className="metadata-grid">
        <div>
          <strong>Creator:</strong> {proposal.creator}
        </div>
        <div>
          <strong>Proposal Contract:</strong>{" "}
          <EtherscanLink type="address" value={proposal.proposalContract} />
        </div>
        <div>
          <strong>Transaction:</strong>{" "}
          <EtherscanLink type="tx" value={proposal.transactionHash} />
        </div>
        <div>
          <strong>Created:</strong> {new Date(proposal.createdAt).toLocaleString()}
        </div>
        <div>
          <strong>Deadline:</strong>{" "}
          {proposal.deadline 
            ? new Date(proposal.deadline * 1000).toLocaleString()
            : "Loading..."
          }
        </div>
        {proposal.executedAt && (
          <div>
            <strong>Executed:</strong> {new Date(proposal.executedAt).toLocaleString()}
          </div>
        )}
        <div>
          <strong>Start Block:</strong> {proposal.startBlock}
        </div>
        {proposal.endBlock && (
          <div>
            <strong>End Block:</strong> {proposal.endBlock}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProposalMetadata

