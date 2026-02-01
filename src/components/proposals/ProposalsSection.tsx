import { useState } from "react"
import CreateProposalButton from "@/components/proposals/CreateProposalButton"
import Modal from "@/components/ui/Modal"
import CreateProposalForm from "@/components/proposals/CreateProposalForm"
import ProposalsList from "@/components/proposals/ProposalsList"

function ProposalsSection() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <section className="proposals-section flex-column gap-20">
            <div className="flex-between-center gap-4">
                <h2 className="mb-0">Proposals</h2>
                <CreateProposalButton onClick={() => setIsOpen(true)} />
            </div>

            <ProposalsList />
            
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create new proposal"
            >
                <CreateProposalForm onSuccess={() => setIsOpen(false)} />
            </Modal>
        </section>
    )
}

export default ProposalsSection