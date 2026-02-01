type Props = {
  description: string
}

function ProposalDescription({ description }: Props) {
  return (
    <section className="proposal-section">
      <h3>Description</h3>
      <p>{description}</p>
    </section>
  )
}

export default ProposalDescription

