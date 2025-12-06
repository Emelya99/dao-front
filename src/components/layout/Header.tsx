import ConnectWalletButton from "@/components/wallet/ConnectWalletButton";
import DisconnectButton from "@/components/wallet/DisconnectButton";
import { useAccount } from "wagmi";

function Header() {
    const { isConnected } = useAccount()

    return (
        <header className="header">
            {isConnected ? <DisconnectButton /> : <ConnectWalletButton />}
        </header>
    )
}

export default Header;