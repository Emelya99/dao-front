import ConnectWalletButton from "@/components/wallet/ConnectWalletButton";
import DisconnectButton from "@/components/wallet/DisconnectButton";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom"
import { ROUTES } from '@/constants/routes'

function Header() {
    const { isConnected } = useAccount()

    return (
        <header className="header">
            <div className="app-container">
                <div className="flex-between-center">
                    <Link to={ROUTES.HOME} className="logo">
                        🗳️ Governance DAO
                    </Link>
                    {isConnected ? <DisconnectButton /> : <ConnectWalletButton />}
                </div>
            </div>
        </header>
    )
}

export default Header;