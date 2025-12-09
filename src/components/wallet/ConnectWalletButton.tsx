import { useAppKit } from "@reown/appkit/react"

const ConnectWalletButton = () => {
  const { open } = useAppKit()

  return (
    <button onClick={() => open()}>
      Connect Wallet
    </button>
  )
}

export default ConnectWalletButton
