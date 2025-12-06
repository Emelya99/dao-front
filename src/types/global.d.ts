import type { Eip1193Provider } from 'viem'

export {}; // ensure module scope

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export type BalanceType = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}
