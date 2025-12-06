import BlockiesSvg from 'blockies-react-svg'

type Props = {
  address: string
}

export const WalletAvatar = ({ address }: Props) => {
  return (
    <BlockiesSvg
      address={address.toLowerCase()}
      size={8}
      scale={5}
      caseSensitive={false}
      className="wallet-avatar"
    />
  )
}
