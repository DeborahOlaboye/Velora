# Velora

**Mutual Aid for the Modern Worker**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built on Celo](https://img.shields.io/badge/Built%20on-Celo-35D07F)](https://celo.org/)
[![Powered by thirdweb](https://img.shields.io/badge/Powered%20by-thirdweb-7C3AED)](https://thirdweb.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636)](https://soliditylang.org/)

</div>

A decentralized mutual aid platform built for gig economy workers. Pool resources collectively, access emergency funds through community governance, and build financial security together.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Velora** empowers gig workers with a financial safety net they control. By combining blockchain transparency, democratic governance, and identity verification, we're building the emergency fund system that the gig economy deserves.

### The Problem

- **1.7 billion** gig workers globally lack employer-provided emergency funds
- **78%** live paycheck to paycheck with no safety net
- Traditional lending excludes those without credit history
- Predatory payday loans charge 400%+ APR

### The Solution

Velora creates a community-owned mutual aid pool where:

- Workers contribute as little as **$5/month** in cUSD stablecoin
- Emergency withdrawals are approved through **democratic voting** (60% threshold)
- Identity verification via **Self Protocol** unlocks higher withdrawal limits
- **0% platform fees** - every dollar goes to members
- **100% transparent** - all transactions visible on Celo blockchain

---

## Key Features

### Core Functionality

- **Worker Registration** - Quick onboarding with worker profile creation
- **Flexible Contributions** - Monthly auto-contribute or one-time deposits (minimum $5 cUSD)
- **Tiered Withdrawal System**
  - **Tier 1 (Unverified)**: Withdraw up to 100% of your total contributions
  - **Tier 2 (Self Protocol Verified)**: Withdraw up to 200% of your contributions
- **Democratic Governance** - Community votes on all withdrawal requests
  - 60% approval threshold required
  - 7-day voting period for deliberation
  - 90-day cooldown between withdrawals
- **Identity Verification** - Privacy-preserving KYC via Self Protocol
- **UBI Integration** - Claim daily GoodDollar UBI and auto-contribute to pool
- **Real-time Analytics** - Track pool statistics, contribution history, and voting activity

### Technical Highlights

- **Gasless Transactions** - Smart wallets powered by thirdweb
- **Multi-Wallet Support** - MetaMask, Coinbase Wallet, Rainbow, WalletConnect, or email/social login
- **Mobile-First** - Built on Celo for fast, low-cost mobile transactions
- **Security First** - OpenZeppelin libraries, reentrancy guards, emergency pause mechanisms
- **Hybrid Architecture** - On-chain state with off-chain metadata (PostgreSQL)

---

## How It Works

### 1. Register as a Worker

Connect your wallet (or create one via email) and provide basic information:
- Gig work type (ride-share, delivery, freelance, etc.)
- Location and years of experience
- Monthly income estimate

### 2. Make Contributions

Contribute to the shared emergency fund:
- Minimum contribution: **5 cUSD**
- Choose monthly auto-contribute or one-time deposits
- All contributions tracked on-chain and in your profile

### 3. Verify Your Identity (Optional)

Complete Self Protocol verification to unlock Tier 2 benefits:
- Scan QR code with Self mobile app
- Complete biometric + document verification
- Unlock 200% withdrawal limit (2x your contributions)

### 4. Request Emergency Withdrawals

When emergencies strike:
- Submit withdrawal request with amount and reason
- Community members receive notification
- 7-day voting period begins

### 5. Community Voting

Registered workers vote on withdrawal requests:
- Review withdrawal reason and urgency
- Vote approve or reject
- 60% approval required for execution
- Fraudulent requests get rejected by the community

### 6. Receive Funds

Approved withdrawals transfer automatically:
- Instant cUSD transfer to your wallet
- 90-day cooldown begins before next request
- Transparent record on Celo blockchain

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.7 | React framework with App Router & API routes |
| **React** | 19.0.0 | UI component library |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **shadcn/ui** | Latest | Accessible UI components (Radix UI) |
| **thirdweb SDK** | 5.112.0 | Web3 wallet connections & smart wallets |
| **wagmi** | 2.19.3 | React hooks for Ethereum |
| **viem** | 2.39.0 | TypeScript Ethereum library |
| **React Query** | 5.90.10 | Server state management |

### Backend

| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless backend functions |
| **PostgreSQL** | Relational database for user metadata |
| **Prisma ORM** | Type-safe database client |
| **Zod** | Runtime validation |

### Blockchain

| Technology | Purpose |
|------------|---------|
| **Solidity** | Smart contract language (v0.8.24) |
| **Foundry** | Solidity development framework |
| **Celo Mainnet** | Primary blockchain (Chain ID: 42220) |
| **Celo Sepolia** | Testnet for development (Chain ID: 11142220) |
| **cUSD** | Dollar-pegged stablecoin for contributions |
| **OpenZeppelin** | Security-audited contract libraries |

### Integrations

| Service | Purpose |
|---------|---------|
| **Self Protocol** | Privacy-preserving KYC/AML verification |
| **GoodDollar** | Universal Basic Income claiming |
| **thirdweb** | Gasless transactions & smart wallet infrastructure |
| **Celo** | Mobile-first blockchain with 1-second finality |

---

## Project Structure

```
Velora/
├── frontend/                      # Next.js application
│   ├── app/                       # App Router pages
│   │   ├── page.tsx               # Landing page
│   │   ├── dashboard/             # Main dashboard
│   │   ├── register/              # Worker registration
│   │   ├── contribute/            # Contribution interface
│   │   ├── withdrawals/           # Withdrawal requests & voting
│   │   ├── verify/                # Self Protocol verification
│   │   └── api/                   # Backend API routes
│   │       ├── users/             # User management
│   │       ├── contributions/     # Contribution tracking
│   │       ├── withdrawals/       # Withdrawal requests
│   │       ├── votes/             # Voting system
│   │       ├── verify/            # Self Protocol webhooks
│   │       └── gooddollar/        # GoodDollar integration
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/                # Header, footer, navigation
│   │   ├── wallet/                # Wallet connection UI
│   │   ├── registration/          # Registration forms
│   │   ├── contributions/         # Contribution widgets
│   │   ├── withdrawals/           # Withdrawal & voting UI
│   │   ├── verification/          # Self Protocol QR code
│   │   ├── gooddollar/            # GoodDollar claim widget
│   │   └── pool/                  # Pool statistics
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utilities & services
│   ├── abi/                       # Smart contract ABIs
│   ├── prisma/                    # Database schema & migrations
│   └── public/                    # Static assets
│
├── contract/                      # Solidity smart contracts
│   ├── src/
│   │   ├── BenefitsPool.sol       # Main mutual aid contract (476 lines)
│   │   └── MockcUSD.sol           # Test token for development
│   ├── test/
│   │   └── BenefitsPool.t.sol     # Foundry test suite
│   ├── script/
│   │   ├── Deploy.s.sol           # Deployment script
│   │   └── Verify.s.sol           # Contract verification script
│   ├── lib/                       # External libraries
│   │   ├── forge-std/             # Foundry standard library
│   │   └── openzeppelin-contracts/ # OpenZeppelin contracts
│   └── foundry.toml               # Foundry configuration
│
├── README.md                      # This file
└── LICENSE                        # MIT License
```
---

## Deployment

### Deployed Contracts (Celo Mainnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| **BenefitsPool** | `0xaD253E6964eB43eD19055d76B77b04c7C1aCCfbC` | [View on CeloScan](https://celoscan.io/address/0xaD253E6964eB43eD19055d76B77b04c7C1aCCfbC) |
| **cUSD Token** | `0x765DE816845861e75A25fCA122bb6898B8B1282a` | [View on CeloScan](https://celoscan.io/address/0x765DE816845861e75A25fCA122bb6898B8B1282a) |
---

## Roadmap

This project is being built in **15 phases with 64 checkpoints**.

### Phase 1: Project Setup ✅ (Complete)

- [x] Initialize Next.js project with TypeScript
- [x] Set up Foundry for smart contract development
- [x] Configure thirdweb SDK integration
- [x] Install and configure Prisma ORM
- [x] Deploy BenefitsPool contract to mainnet

### Phase 2: Core Features (In Progress)

- [x] Worker registration flow
- [x] Contribution system with cUSD
- [x] Withdrawal request submission
- [x] Community voting mechanism
- [x] Self Protocol verification
- [x] GoodDollar UBI integration
- [ ] Mobile app (React Native)
- [ ] Smart contract security audit

### Phase 3: Enhanced Features (Q1 2026)

- [ ] Automated contribution scheduling
- [ ] Multi-language support (Spanish, Tagalog, Indonesian)
- [ ] Push notifications for votes and approvals
- [ ] In-app community chat
- [ ] Advanced analytics dashboard
- [ ] Reputation system for voters

### Phase 4: Scale & Revenue (Q2-Q3 2026)

- [ ] Premium tier features ($5/month)
- [ ] DeFi yield on idle reserves
- [ ] Partnership integrations (ride-share platforms)
- [ ] Insurance product MVP
- [ ] Multi-chain expansion (Polygon, Base, Optimism)

### Phase 5: Decentralization (2026)

- [ ] DAO governance launch
- [ ] Token-based voting
- [ ] Governance token distribution
- [ ] Protocol fee introduction (0.5%)
- [ ] Community grants program

---

## Contributing

Velora is built for **Proof of Ship #10** (November 2025) on the Celo blockchain.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation for API changes
- Follow the existing code style (use ESLint)
- Keep commits atomic and well-described

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers get started
- Report security issues privately

---

## Security

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Please report security issues to: **security@velora.network**

We take security seriously and will respond within 24 hours.

### Smart Contract Security

- OpenZeppelin libraries (battle-tested)
- ReentrancyGuard on all withdrawals
- Pausable emergency stop mechanism
- Multi-signature admin controls
- Planned audit by CertiK or OpenZeppelin

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

**Built With**
- [Celo](https://celo.org/) - Mobile-first blockchain platform
- [thirdweb](https://thirdweb.com/) - Web3 development framework
- [Self Protocol](https://www.self.xyz/) - Privacy-preserving identity verification
- [GoodDollar](https://www.gooddollar.org/) - Universal Basic Income protocol
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [OpenZeppelin](https://www.openzeppelin.com/) - Secure smart contract libraries
- [Foundry](https://getfoundry.sh/) - Blazing fast Solidity toolkit

**Supported By**
- Celo Foundation
- Proof of Ship #10
- thirdweb Ecosystem Grants

---

## Contact & Support

**Project Links**
- **Website**: [https://velora-gilt.vercel.app](https://velora-gilt.vercel.app)
- **Documentation**: [https://github.com/DeborahOlaboye/Velora](https://github.com/DeborahOlaboye/Velora)
- **Email**: deboraholaboye@gmail.com
---

<div align="center">

**Velora: Building Financial Security for 1.7 Billion Gig Workers**

*Empowering workers through community, transparency, and technology*
</div>
