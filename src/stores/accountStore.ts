import { create } from 'zustand'

type AccountState = {
  address: string | null
  balance: string | null
  symbol: string | null
  chainId: number | null
  chainName: string | null
  isWrongNetwork: boolean

  setAddress: (value: string | null) => void
  setBalance: (value: string | null) => void
  setSymbol: (value: string | null) => void
  setChain: (id: number | null, name: string | null) => void
  setWrongNetwork: (value: boolean) => void

  reset: () => void
}

export const useAccountStore = create<AccountState>((set) => ({
  address: null,
  balance: null,
  symbol: null,
  chainId: null,
  chainName: null,
  isWrongNetwork: false,

  setAddress: (value) => set({ address: value }),
  setBalance: (value) => set({ balance: value }),
  setSymbol: (value) => set({ symbol: value }),
  setChain: (id, name) => set({ chainId: id, chainName: name }),
  setWrongNetwork: (value) => set({ isWrongNetwork: value }),

  reset: () =>
    set({
      address: null,
      balance: null,
      symbol: null,
      chainId: null,
      chainName: null,
      isWrongNetwork: false,
    }),
}))
