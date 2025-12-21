import { ETHERSCAN_BASE_URL } from '@/constants'

type EtherscanType = 'address' | 'tx' | 'block'

type Props = {
  type: EtherscanType
  value: string
  children?: React.ReactNode
}

function EtherscanLink({ type, value, children }: Props) {
  const url = `${ETHERSCAN_BASE_URL}/${type}/${value}`
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="etherscan-link"
    >
      {children || value}
    </a>
  )
}

export default EtherscanLink

