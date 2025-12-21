import { useTokenStore } from '@/stores/tokenStore'

export function formatTokenAmount(
  value: number | string | bigint,
  maxDecimals: number = 2
): string {
  const tokenDecimals = useTokenStore.getState().tokenDecimals
  
  const bigValue = BigInt(value.toString())
  const divisor = BigInt(10 ** tokenDecimals)
  
  const integerPart = bigValue / divisor
  const fractionalPart = bigValue % divisor
  
  if (fractionalPart === 0n) {
    return integerPart.toString()
  }
  
  // Convert fractional part to decimal string
  const fractionalStr = fractionalPart.toString().padStart(tokenDecimals, '0')
  const trimmed = fractionalStr.slice(0, maxDecimals).replace(/0+$/, '')
  
  if (trimmed === '') {
    return integerPart.toString()
  }
  
  return `${integerPart}.${trimmed}`
}

