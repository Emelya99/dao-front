import { useDisconnect, useAccount } from 'wagmi'

const DisconnectButton = () => {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (!isConnected) return null

  return <button onClick={() => disconnect()}>Disconnect</button>
}

export default DisconnectButton
