import { create } from 'zustand'

type TokenState = {
  tokenBalance: string | null
  tokenSymbol: string | null

  setToken: (value: string | null, symbol: string | null) => void
  reset: () => void
}

export const useTokenStore = create<TokenState>((set) => ({
  tokenBalance: null,
  tokenSymbol: null,

  setToken: (value, symbol) => set({
    tokenBalance: value,
    tokenSymbol: symbol
  }),

  reset: () =>
    set({
      tokenBalance: null,
      tokenSymbol: null,
    }),
}))
