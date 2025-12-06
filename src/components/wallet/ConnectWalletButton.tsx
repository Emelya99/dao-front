import { useConnect, useConnectors } from 'wagmi'

const ConnectWalletButton = () => {
  const { connect } = useConnect()
  const connectors = useConnectors()

  const metaMaskConnector = connectors.find((c) => c.name === 'MetaMask')

  return (
    <button
      onClick={() => metaMaskConnector && connect({ connector: metaMaskConnector })}
    >
      Connect Wallet
    </button>
  )
}

export default ConnectWalletButton
