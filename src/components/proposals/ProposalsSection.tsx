import { useState } from "react"
import CreateProposalButton from "@/components/proposals/CreateProposalButton"
import Modal from "@/components/ui/Modal"
import CreateProposalForm from "@/components/proposals/CreateProposalForm"

function ProposalsSection() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <section className="proposals-section">
            <div className="flex-between-center">
                <h2>Proposals</h2>
                <CreateProposalButton onClick={() => setIsOpen(true)} />
            </div>
            
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