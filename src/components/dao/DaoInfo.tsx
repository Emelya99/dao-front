import { useReadContract, useWatchContractEvent } from 'wagmi'
import { CONTRACTS, getContractInfo } from '@/contracts'
import { formatTokenAmount } from '@/utils/formatToken'
import { TAddress } from '@/types/web3'

const DaoInfo = () => {
  const daoContract = getContractInfo(CONTRACTS.DAO_CONTRACT)
  
  // Read minTokensToCreateProposal from DAO contract
  const { data: minTokens, isLoading: loadingMinTokens, refetch: refetchMinTokens } = useReadContract({
    address: daoContract.address as TAddress,
    abi: daoContract.abi,
    functionName: 'minTokensToCreateProposal',
  })

  // Read votingPeriod from DAO contract
  const { data: votingPeriod, isLoading: loadingVotingPeriod, refetch: refetchVotingPeriod } = useReadContract({
    address: daoContract.address as TAddress,
    abi: daoContract.abi,
    functionName: 'votingPeriod',
  })

  // Watch for ProposalExecuted events to immediately refetch DAO parameters
  useWatchContractEvent({
    address: daoContract.address as TAddress,
    abi: daoContract.abi,
    eventName: 'ProposalExecuted',
    onLogs: (_logs) => {
      // Immediately refetch both values when a proposal is executed
      refetchMinTokens()
      refetchVotingPeriod()
    },
  })

  if (loadingMinTokens || loadingVotingPeriod) {
    return (
      <section>
        <h3>DAO Info</h3>
        <p>Loading...</p>
      </section>
    )
  }

  // Convert votingPeriod from seconds to minutes
  const votingPeriodMinutes = votingPeriod ? Number(votingPeriod) / 60 : 0
  const minTokensFormatted = minTokens !== undefined && minTokens !== null 
    ? formatTokenAmount(minTokens as bigint) 
    : '0'

  return (
    <section>
      <h3>DAO Info</h3>
      <p><b>Min Tokens to Create Proposal:</b> {minTokensFormatted}</p>
      <p><b>Voting Period:</b> {votingPeriodMinutes} minutes</p>
    </section>
  )
}

export default DaoInfo

