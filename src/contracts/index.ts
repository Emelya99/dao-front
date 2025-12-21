import DaoContractAbi from '@/contracts/abi/DaoContactAbi.json'
import TokenContractAbi from '@/contracts/abi/TokenContractAbi.json'
import ProposalContractAbi from '@/contracts/abi/ProposalContractAbi.json'

export enum CONTRACTS {
    DAO_CONTRACT, 
    TOKEN_CONTRACT,
    PROPOSAL_CONTRACT // Dynamic address - created per proposal
}

export const CONTRACT_ADDRESSES = {
    [CONTRACTS.DAO_CONTRACT]: import.meta.env.VITE_DAO_CONTRACT,
    [CONTRACTS.TOKEN_CONTRACT]: import.meta.env.VITE_TOKEN_CONTRACT,
    // PROPOSAL_CONTRACT has no fixed address - each proposal has unique address
}

export const CONTRACT_ABIS = {
    [CONTRACTS.DAO_CONTRACT]: DaoContractAbi,
    [CONTRACTS.TOKEN_CONTRACT]: TokenContractAbi,
    [CONTRACTS.PROPOSAL_CONTRACT]: ProposalContractAbi,
}

// For contracts with fixed addresses (DAO, TOKEN)
export function getContractInfo(name: CONTRACTS.DAO_CONTRACT | CONTRACTS.TOKEN_CONTRACT) {
    return {
        address: CONTRACT_ADDRESSES[name],
        abi: CONTRACT_ABIS[name],
    }
}

// For getting just the ABI (useful for dynamic contracts like Proposal)
export function getContractAbi(name: CONTRACTS) {
    return CONTRACT_ABIS[name]
}
