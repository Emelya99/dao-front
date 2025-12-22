import WalletInfo from '@/components/wallet/WalletInfo'
import DaoInfo from '@/components/dao/DaoInfo'
import ProposalsSection from '@/components/proposals/ProposalsSection'

function HomePage() {
  return (
    <>
      <WalletInfo />
      <DaoInfo />
      <ProposalsSection />
    </>
  )
}

export default HomePage

