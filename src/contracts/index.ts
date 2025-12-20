import DaoContractAbi from '@/contracts/abi/DaoContactAbi.json'
import TokenContractAbi from '@/contracts/abi/TokenContractAbi.json'

export enum CONTRACTS {
    DAO_CONTRACT, 
    TOKEN_CONTRACT
}

export const CONTRACT_ADDRESSES = {
    [CONTRACTS.DAO_CONTRACT]: import.meta.env.VITE_DAO_CONTRACT,
    [CONTRACTS.TOKEN_CONTRACT]: import.meta.env.VITE_TOKEN_CONTRACT,
}

export const CONTRACT_ABIS = {
    [CONTRACTS.DAO_CONTRACT]: DaoContractAbi,
    [CONTRACTS.TOKEN_CONTRACT]: TokenContractAbi,
}

export function getContractInfo(name: keyof typeof CONTRACT_ADDRESSES) {
    return {
        address: CONTRACT_ADDRESSES[name],
        abi: CONTRACT_ABIS[name],
    }
}