import ConnectWalletButton from "@/components/wallet/ConnectWalletButton";
import DisconnectButton from "@/components/wallet/DisconnectButton";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom"
import { ROUTES } from '@/constants/routes'

function Header() {
    const { isConnected } = useAccount()

    return (
        <header className="header">
            <div className="flex-between-center">
                <Link to={ROUTES.HOME} className="logo">DAO LOGO</Link>
                {isConnected ? <DisconnectButton /> : <ConnectWalletButton />}
            </div>
        </header>
    )
}

export default Header;