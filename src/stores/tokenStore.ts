import { create } from 'zustand'

type TokenState = {
  tokenBalance: string | null
  tokenSymbol: string | null
  tokenDecimals: number

  setToken: (value: string | null, symbol: string | null, decimals?: number) => void
  reset: () => void
}

export const useTokenStore = create<TokenState>((set) => ({
  tokenBalance: null,
  tokenSymbol: null,
  tokenDecimals: 8,

  setToken: (value, symbol, decimals = 8) => set({
    tokenBalance: value,
    tokenSymbol: symbol,
    tokenDecimals: decimals,
  }),

  reset: () =>
    set({
      tokenBalance: null,
      tokenSymbol: null,
      tokenDecimals: 8,
    }),
}))
