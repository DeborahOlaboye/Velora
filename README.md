# Velora

**Mutual Aid for the Modern Worker**

A decentralized platform where gig workers collectively pool resources for emergency funds, with Self Protocol verification, GoodDollar integration, and smart contract-based mutual aid system built on Celo blockchain.

## Project Overview

This platform enables gig workers to:
- Pool resources collectively for emergency funds
- Access mutual aid through community voting
- Verify identity through Self Protocol
- Supplement income with GoodDollar UBI integration
- Make gasless transactions via thirdweb smart wallets

## Tech Stack

### Frontend
- Next.js 14+ with TypeScript
- Tailwind CSS + shadcn/ui components
- thirdweb SDK for Web3 interactions
- wagmi/viem for blockchain operations

### Backend
- Next.js API routes
- PostgreSQL/MongoDB database
- Prisma ORM

### Blockchain
- Celo network (Alfajores testnet → Mainnet)
- Solidity smart contracts
- Hardhat for development
- cUSD stablecoin for contributions

### Key Integrations
- **Self Protocol SDK** - Identity verification/KYC
- **GoodDollar Claim SDK** - UBI supplemental income
- **thirdweb** - Smart wallets, gasless transactions, RPC

## Monorepo Structure

```
.
├── apps/
│   └── web/              # Next.js frontend application
├── packages/
│   ├── contracts/        # Smart contracts (Solidity)
│   └── shared/           # Shared types and utilities
└── CELO.md              # Detailed build instructions
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A wallet (MetaMask, Coinbase Wallet, etc.)
- Celo Alfajores testnet tokens for testing

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```env
# Celo RPC
NEXT_PUBLIC_CELO_RPC_URL=

# thirdweb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
THIRDWEB_SECRET_KEY=

# Self Protocol
NEXT_PUBLIC_SELF_PROTOCOL_APP_ID=
SELF_PROTOCOL_SECRET=

# GoodDollar
NEXT_PUBLIC_GOODDOLLAR_ENV=

# Database
DATABASE_URL=
```

## Development

```bash
# Run frontend dev server
npm run dev

# Build frontend
npm run build

# Run linting
npm run lint

# Compile smart contracts
npm run contracts:compile

# Test smart contracts
npm run contracts:test

# Deploy contracts
npm run contracts:deploy
```

## Project Milestones

This project is being built in 15 phases with 64 checkpoints. See [CELO.md](./CELO.md) for detailed implementation roadmap.

### Current Phase: Phase 1 - Project Setup ✅

- [x] Initialize Next.js project
- [x] Set up monorepo structure
- [ ] Environment configuration
- [ ] Install Web3 SDKs
- [ ] Development tools setup

## Key Features

### Core MVP Features
- Worker registration with Self Protocol verification
- Monthly contribution system using cUSD
- Emergency withdrawal request submission
- Community voting on withdrawals
- Automated fund distribution
- GoodDollar claiming and optional auto-contribute
- Pool analytics dashboard
- Basic admin moderation tools

## Partner Integrations

- **Self Protocol**: Identity verification before pool participation
- **GoodDollar**: UBI claims that can supplement pool contributions
- **thirdweb**: Gasless transactions with smart wallets (Code: CELO-STARTER-2M)
- **Celo**: Fast, low-cost transactions with mobile-first approach

## Contributing

This is a Proof of Ship project. For contribution guidelines, please see the main documentation.

## License

MIT

## Contact & Support

Built for Proof of Ship #10 - End of November 2024

---

**Target Users**: Gig economy workers needing emergency fund safety net
**Social Impact**: Addresses financial insecurity in the gig economy
