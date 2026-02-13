## AYEM DAO Frontend

React-based web interface for interacting with the on-chain DAO governance system. Provides wallet connection, proposal management, voting, and real-time blockchain event tracking.

**Part of a full-stack DAO project:**
- [Live Demo](https://dao-front.vercel.app) - Try the DAO in action
- [Contracts Repository](https://github.com/Emelya99/dao) - Smart contracts implementation
- [Backend Repository](https://github.com/Emelya99/dao-backend) - API and backend services

### Features

- **Wallet integration**: Reown AppKit (WalletConnect) for multi-wallet support with automatic network switching to Hoodi Network
- **SIWE authentication**: Sign-In with Ethereum flow for backend authentication. Auto-authenticates on wallet connect, handles address changes, and manages session state
- **Proposal management**: Create proposals with custom execution data (token transfers, contract calls, token burns). Form validation and execution data encoding
- **Voting system**: Token-weighted voting with real-time vote tracking. Prevents duplicate votes, shows voting eligibility, and displays live vote counts
- **Proposal execution**: Execute successful proposals with quorum validation. Checks execution eligibility (deadline passed, quorum met, not already executed)
- **Real-time updates**: Event listeners for `ProposalCreated` and `ProposalExecuted` events. Automatically updates UI when proposals are created or executed on-chain
- **Pending transaction tracking**: Monitors pending transactions, removes them from storage on confirmation, and shows toast notifications
- **Backend API integration**: Fetches proposal data, voting results, and handles authentication via REST API. Uses axios for HTTP requests and Zustand stores for client-side caching
- **Faucet integration**: Request test governance tokens directly from the UI (testnet only)
- **State management**: Zustand stores for proposals, authentication, account, and token balances. Optimistic updates for votes and proposals

### Tech stack

- **Language**: TypeScript `^5.9.3`
- **Framework**: React `^19.2.0`
- **Build tool**: Vite `^7.2.4`
- **Blockchain**: Wagmi `^2.15.6` + Viem `^2.31.7` + ethers.js `^6.15.0`
- **Wallet**: Reown AppKit `^1.7.17` (WalletConnect)
- **Routing**: React Router DOM `^7.11.0`
- **State management**: Zustand `^5.0.9`
- **HTTP client**: axios for API requests
- **Data fetching**: Custom hooks with Zustand caching
- **Authentication**: SIWE `^3.0.0`
- **UI**: React Hot Toast `^2.6.0` for notifications

### Environment Variables

```env
VITE_API_URL=<Backend API URL>
VITE_PROJECT_ID=<Reown AppKit Project ID>
VITE_ALCHEMY_KEY=<Alchemy API key for Hoodi Network RPC>
```

### Running

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### How It Works

1. **Wallet connection**: User connects wallet via Reown AppKit. App automatically switches to Hoodi Network if needed
2. **SIWE authentication**: On wallet connect, app requests nonce from backend, prepares SIWE message, user signs it, backend verifies signature and returns JWT token
3. **Proposal creation**: User fills form with description and execution data. Frontend encodes execution data (target address, value, calldata) and calls `createProposal` on DAO contract. Transaction is tracked in sessionStorage
4. **Event listening**: `EventListener` component watches DAO contract for `ProposalCreated` and `ProposalExecuted` events. When detected, updates Zustand store and shows toast notifications
5. **Voting**: User votes on proposal by calling `vote` function on proposal contract. Vote state is tracked optimistically in Zustand store. Separate event listener watches proposal contract for `Vote` events
6. **Data fetching**: Proposals list and details are fetched from backend API (which syncs blockchain events). Voting results include individual votes with voter addresses and weights
7. **Execution**: When proposal deadline passes and quorum is met, user can execute proposal. Frontend calls `executeProposal` on DAO contract, which performs low-level call to proposal's target address

**Note**: Frontend uses sessionStorage for wallet connection persistence and pending transaction tracking. All blockchain interactions go through Wagmi hooks, which handle RPC calls, transaction signing, and event watching automatically.
