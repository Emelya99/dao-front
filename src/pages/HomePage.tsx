import WalletInfo from '@/components/wallet/WalletInfo'
import DaoInfo from '@/components/dao/DaoInfo'
import ProposalsSection from '@/components/proposals/ProposalsSection'
import AboutSection from '@/components/about/AboutSection'

function HomePage() {
  return (
    <>
      <WalletInfo />
      <DaoInfo />
      <ProposalsSection />
      <AboutSection />
    </>
  )
}

export default HomePage

