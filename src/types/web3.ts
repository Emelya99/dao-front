export type TAddress = `0x${string}`
export type THex = `0x${string}`
export type THash = `0x${string}`
export type TWei = bigint

// Error types for catch blocks
export interface ErrorWithCode {
  code?: number
  message?: string
  shortMessage?: string
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
      error?: string
    }
  }
  message?: string
}

export type CatchError = Error | ErrorWithCode | ApiError | unknown