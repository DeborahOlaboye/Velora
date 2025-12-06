# Velora Contract Integration Guide

This document provides a comprehensive guide to the Velora BenefitsPool contract integration with the frontend.

## Table of Contents
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Features Implemented](#features-implemented)
- [Testing Guide](#testing-guide)
- [Troubleshooting](#troubleshooting)

## Overview

Velora is a mutual aid platform for gig workers, built on Celo blockchain. Workers can:
- Register and contribute to a shared emergency fund
- Request withdrawals (up to 100% without verification, 200% with verification)
- Vote on community withdrawal requests (if verified)
- Execute approved withdrawals after voting period

### Contract Details
- **Network**: Celo Mainnet (Chain ID: 42220)
- **Contract Address**: `0xaD253E6964eB43eD19055d76B77b04c7C1aCCfbC`
- **cUSD Token**: `0x765DE816845861e75A25fCA122bb6898B8B1282a`

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Celo network configured in your wallet
- Some CELO for gas fees
- cUSD tokens for testing contributions

### Environment Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**:
   Update `.env.local` with your values:
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_CELO_RPC_URL=https://celo.drpc.org
   NEXT_PUBLIC_CHAIN_ID=42220
   NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS=0xaD253E6964eB43eD19055d76B77b04c7C1aCCfbC
   NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
   THIRDWEB_SECRET_KEY=your_secret_here
   NEXT_PUBLIC_SELF_PROTOCOL_APP_ID=your_app_id_here
   SELF_PROTOCOL_SECRET=your_secret_here
   NEXT_PUBLIC_GOODDOLLAR_ENV=production
   DATABASE_URL=your_database_url_here
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000)

## Architecture

### Contract Integration Files

#### ABIs (`/frontend/abi/`)
- `BenefitsPool.json` - Main contract ABI
- `IERC20.json` - cUSD token ABI

#### Utilities (`/frontend/lib/`)
- `contracts.ts` - Contract instances and addresses
- `token-utils.ts` - Token formatting, parsing, and approval helpers
- `thirdweb-client.ts` - Thirdweb configuration

#### Custom Hooks (`/frontend/hooks/`)
- `useWorkerInfo.ts` - Fetch worker registration & contribution data
- `usePoolStats.ts` - Fetch pool statistics
- `useWithdrawalRequest.ts` - Fetch individual withdrawal requests
- `useWithdrawalLimits.ts` - Fetch withdrawal tier limits
- `useHasVoted.ts` - Check if user voted on a request
- `useCUSDBalance.ts` - Check cUSD token balance
- `useCUSDAllowance.ts` - Check cUSD token allowance

### Component Integration

#### Registration (`/components/registration/`)
- **worker-registration-form.tsx** - Calls `registerWorker()` on contract
  - Validates wallet connection
  - Checks if already registered
  - Stores additional metadata in database

#### Contributions (`/components/contributions/`)
- **make-contribution.tsx** - Calls `contribute()` with cUSD approval
  - Two-step process: Approve cUSD → Contribute
  - Shows current balance and allowance
  - Validates minimum contribution (5 cUSD)
  - Checks registration status

#### Withdrawals (`/components/withdrawals/`)
- **withdrawal-request-form.tsx** - Calls `requestWithdrawal()`
  - Fetches real-time withdrawal limits from contract
  - Shows tier-based limits (Tier 1: 100%, Tier 2: 200%)
  - Validates against contribution balance
  - Smart alerts based on requested amount

- **active-requests.tsx** - Voting and execution
  - Displays all active withdrawal requests from contract
  - Calls `voteOnWithdrawal()` for verified workers
  - Calls `executeWithdrawal()` after voting period ends
  - Shows voting progress and time remaining

#### Profile & Dashboard
- **worker-profile.tsx** - Real-time contract data
  - Shows contributions, withdrawal limits, verification status
  - Editable profile fields stored in database

- **pool-stats.tsx** - Live pool statistics
  - Total pool balance
  - Total registered workers
  - Active withdrawal requests

## Features Implemented

### ✅ Core Features

#### 1. Worker Registration
- **Page**: `/register`
- **Contract Function**: `registerWorker()`
- **Features**:
  - Multi-step form with validation
  - On-chain registration
  - Database storage for additional metadata
  - Automatic redirect on success

#### 2. Contributions
- **Page**: `/contribute`
- **Contract Functions**: `approve()` (cUSD), `contribute()`
- **Features**:
  - cUSD balance display
  - Two-step approval flow
  - Minimum contribution validation (5 cUSD)
  - Real-time balance updates

#### 3. Withdrawal Requests
- **Page**: `/withdrawals`
- **Contract Function**: `requestWithdrawal()`
- **Features**:
  - Tier-based limits (100% / 200%)
  - Smart alerts for verification requirement
  - Reason and urgency tracking
  - Real-time limit calculations

#### 4. Voting System
- **Page**: `/withdrawals` (Active Requests)
- **Contract Function**: `voteOnWithdrawal()`
- **Features**:
  - Only verified workers can vote
  - Cannot vote on own requests
  - Real-time vote counts
  - Voting deadline tracking
  - Progress bar visualization

#### 5. Withdrawal Execution
- **Page**: `/withdrawals` (Active Requests)
- **Contract Function**: `executeWithdrawal()`
- **Features**:
  - Available after 7-day voting period
  - Automatic approval/rejection based on 60% threshold
  - Anyone can execute (permissionless)

#### 6. Dashboard
- **Page**: `/dashboard`
- **Features**:
  - Pool statistics (balance, workers, requests)
  - Personal stats (balance, contributions, limits)
  - Quick actions
  - Verification status
  - Integration with GoodDollar widget

#### 7. Verification
- **Page**: `/verify`
- **Features**:
  - Self Protocol integration
  - Benefits explanation
  - Tier comparison
  - Verification flow

## Testing Guide

### Test Flow Checklist

#### 1. Setup Wallet
- [ ] Install MetaMask
- [ ] Add Celo network
- [ ] Get CELO for gas (from faucet or exchange)
- [ ] Get cUSD tokens

#### 2. Registration Flow
- [ ] Navigate to `/register`
- [ ] Fill out worker information
- [ ] Submit registration
- [ ] Confirm transaction in wallet
- [ ] Verify success message

#### 3. Contribution Flow
- [ ] Navigate to `/contribute`
- [ ] Check cUSD balance display
- [ ] Enter contribution amount (minimum 5 cUSD)
- [ ] Click "Approve cUSD" button
- [ ] Confirm approval transaction
- [ ] Click "Contribute" button
- [ ] Confirm contribution transaction
- [ ] Verify balance updates

#### 4. Withdrawal Request Flow
- [ ] Navigate to `/withdrawals`
- [ ] Check withdrawal limits display
- [ ] Enter withdrawal amount
- [ ] Provide reason for emergency
- [ ] Submit request
- [ ] Confirm transaction
- [ ] Verify request appears in Active Requests

#### 5. Voting Flow (Requires Verification)
- [ ] Complete Self Protocol verification
- [ ] Wait for admin to verify on-chain
- [ ] Navigate to `/withdrawals`
- [ ] Find an active request (not your own)
- [ ] Click "Approve" or "Deny"
- [ ] Confirm transaction
- [ ] Verify vote count updates

#### 6. Execution Flow
- [ ] Wait for 7-day voting period to end
- [ ] Navigate to `/withdrawals`
- [ ] Find completed voting request
- [ ] Click "Execute Withdrawal"
- [ ] Confirm transaction
- [ ] Verify funds transferred (if approved)

### Contract Verification

You can verify contract state directly using:

```javascript
// In browser console after connecting wallet
const contract = getBenefitsPoolContract();

// Check worker info
const workerInfo = await readContract({
  contract,
  method: "function getWorkerInfo(address _worker) view returns (bool isRegistered, bool isVerified, uint256 totalContributions, uint256 lastContributionTime, uint256 joinedAt, uint256 lastWithdrawalTime, uint256 withdrawalCount)",
  params: ["YOUR_ADDRESS"]
});

// Check pool stats
const poolStats = await readContract({
  contract,
  method: "function getPoolStats() view returns (uint256 balance, uint256 workers_count, uint256 activeRequests)",
  params: []
});
```

## Troubleshooting

### Common Issues

#### Transaction Fails: "Not registered"
- **Solution**: Complete worker registration at `/register` first

#### Transaction Fails: "Below minimum contribution"
- **Solution**: Contribute at least 5 cUSD

#### Transaction Fails: "Transfer failed"
- **Solution**: Approve cUSD spending first (two-step process)

#### Cannot vote on request
- **Solutions**:
  - Verify your identity at `/verify`
  - Check if voting period ended
  - Ensure it's not your own request

#### Withdrawal limit showing as 0
- **Solutions**:
  - Make at least one contribution first
  - Wait for transaction to confirm
  - Refresh the page

#### MetaMask network mismatch
- **Solution**: Switch to Celo network (Chain ID: 42220)

### Getting Help

1. Check browser console for error messages
2. Verify wallet is connected to Celo network
3. Ensure sufficient CELO for gas fees
4. Confirm transaction on block explorer:
   - Mainnet: https://celoscan.io
   - Testnet: https://alfajores.celoscan.io

### Contract Owner Functions

Only contract owner can call:
- `verifyWorker(address)` - Verify a worker's identity
- `setMinimumContribution(uint256)` - Update minimum contribution
- `setVotingThreshold(uint256)` - Update voting threshold
- `emergencyPause()` / `unpause()` - Emergency controls

## Additional Resources

- **Celo Docs**: https://docs.celo.org
- **Thirdweb Docs**: https://portal.thirdweb.com
- **Self Protocol**: https://www.selfprotocol.com
- **GoodDollar**: https://www.gooddollar.org

## Smart Contract Functions Reference

### Read Functions
- `getWorkerInfo(address)` - Get worker details
- `getPoolStats()` - Get pool statistics
- `getWithdrawalRequest(uint256)` - Get request details
- `getWithdrawalLimits(address)` - Get withdrawal limits
- `hasVoted(uint256, address)` - Check voting status
- `getContractBalance()` - Get contract cUSD balance

### Write Functions
- `registerWorker()` - Register as new worker
- `contribute(uint256)` - Contribute to pool
- `requestWithdrawal(uint256, string)` - Request withdrawal
- `voteOnWithdrawal(uint256, bool)` - Vote on request
- `executeWithdrawal(uint256)` - Execute approved request

### Events
- `WorkerRegistered(address, uint256)`
- `WorkerVerified(address, uint256)`
- `ContributionMade(address, uint256, uint256)`
- `WithdrawalRequested(uint256, address, uint256, string, uint256)`
- `VoteCast(uint256, address, bool, uint256)`
- `WithdrawalExecuted(uint256, address, uint256, uint256)`
- `WithdrawalRejected(uint256, uint256)`

---

**Note**: This integration is production-ready. All core features have been implemented and tested. Users can now interact with the deployed BenefitsPool contract through the frontend.
