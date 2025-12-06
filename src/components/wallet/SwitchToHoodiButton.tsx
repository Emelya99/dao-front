import { useSwitchChain } from 'wagmi'
import { HOODI_CHAIN_ID } from '@/constants'

const SwitchToHoodiButton = () => {
  const { switchChain } = useSwitchChain()

  return (
    <button onClick={() => switchChain({ chainId: HOODI_CHAIN_ID })}>
      Switch to Hoodi
    </button>
  )
}

export default SwitchToHoodiButton
