type Props = {
  description: string
}

function ProposalDescription({ description }: Props) {
  return (
    <div className="description-section">
      <h3 style={{ marginBottom: '16px' }}>Description</h3>
      <p>{description}</p>
    </div>
  )
}

export default ProposalDescription

