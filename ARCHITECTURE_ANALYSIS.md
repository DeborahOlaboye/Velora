# Velora Architecture & User Flow Analysis

**Date**: December 6, 2024
**Purpose**: Comprehensive analysis of current architecture and proper user flow

---

## 🏗️ Current Architecture

### Smart Contract Layer

**Contracts Deployed**: **1** (Single Contract Architecture)

#### BenefitsPool.sol
- **Purpose**: All-in-one mutual aid pool management
- **Functions**:
  - `registerWorker()` - Worker self-registration
  - `verifyWorker(address)` - Manual verification by owner ⚠️
  - `contribute(uint256)` - Make contributions
  - `requestWithdrawal(uint256, string)` - Request emergency funds
  - `voteOnWithdrawal(uint256, bool)` - Community voting
  - `executeWithdrawal(uint256)` - Execute approved withdrawals

**Current Design**: ✅ **Monolithic Contract** (All logic in one contract)

---

## 🔍 Architecture Assessment

### Current Approach: Single Contract ✅ **ACCEPTABLE FOR MVP**

**Pros**:
- ✅ Simpler deployment
- ✅ Lower gas costs (no cross-contract calls)
- ✅ Easier to audit (all logic in one place)
- ✅ Sufficient for 100-500 users

**Cons**:
- ⚠️ Not upgradeable (bugs = redeployment)
- ⚠️ Centralized verification (owner controls)
- ⚠️ Harder to extend functionality
- ⚠️ Single point of failure

### Alternative Approach: Multi-Contract ❌ **NOT NEEDED YET**

```solidity
// What a multi-contract architecture would look like:

1. IdentityRegistry.sol
   - registerUser()
   - verifyIdentity()
   - checkVerification()

2. BenefitsPool.sol
   - contribute()
   - checkEligibility()

3. WithdrawalGovernance.sol
   - requestWithdrawal()
   - vote()
   - execute()

4. Treasury.sol
   - holdFunds()
   - distribute()
```

**When to consider**: When you have 1000+ users and need modularity

---

## 🚨 CRITICAL ISSUE FOUND

### Problem: Manual Verification Defeats Purpose

```solidity
// Current (WRONG for production):
function verifyWorker(address _worker) external onlyOwner {
    require(workers[_worker].isRegistered, "Worker not registered");
    require(!workers[_worker].isVerified, "Already verified");

    workers[_worker].isVerified = true;  // ⚠️ MANUAL!
    verifiedIdentities[_worker] = true;
}
```

**Issues**:
1. ❌ Owner must manually verify each user (doesn't scale)
2. ❌ Centralized trust (defeats Web3 purpose)
3. ❌ No connection to Self Protocol
4. ❌ Bottleneck for user onboarding

### Solution: Automated Verification Oracle

**You need TWO components**:

#### Option A: Simple Webhook (Recommended for MVP)

```typescript
// Backend: API route receives Self Protocol callback
POST /api/verify/webhook
  ↓
Verify webhook signature
  ↓
Update database: user.isSelfVerified = true
  ↓
Call contract.verifyWorker(userAddress) with BACKEND_WALLET
```

**Implementation**: Already partially done in `frontend/app/api/verify/webhook/route.ts`

#### Option B: On-Chain Oracle (Better for production)

```solidity
// New contract: IdentityOracle.sol
contract IdentityOracle {
    mapping(address => bool) public verifiers;  // Multiple verifiers
    mapping(address => mapping(address => bool)) public verifications;

    function verifyUser(address user) external onlyVerifier {
        verifications[msg.sender][user] = true;
        if (getVerificationCount(user) >= THRESHOLD) {
            benefitsPool.verifyWorker(user);
        }
    }
}
```

---

## 📊 PROPER USER FLOW

### Flow 1: Worker Registration & Verification

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: REGISTRATION                                        │
└─────────────────────────────────────────────────────────────┘

User (Browser)
    │
    ├─> Connect Wallet
    │       │
    │       └─> MetaMask/Coinbase Wallet connects
    │
    ├─> Click "Register as Worker"
    │       │
    │       ├─> Frontend calls BenefitsPool.registerWorker()
    │       │
    │       └─> ON-CHAIN: Worker registered (isRegistered = true)
    │
    └─> Redirected to verification page


┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: IDENTITY VERIFICATION (Self Protocol)              │
└─────────────────────────────────────────────────────────────┘

User (Browser)
    │
    ├─> Click "Verify Identity"
    │       │
    │       └─> QR Code displayed (Self Protocol SDK)
    │
    ├─> Scan QR with Self Mobile App
    │       │
    │       ├─> Upload government ID
    │       ├─> Facial recognition
    │       └─> Liveness check
    │
    └─> Self Protocol verifies identity

Self Protocol Backend
    │
    └─> Sends webhook to YOUR backend
            │
            POST /api/verify/webhook
                │
                ├─> Verify signature
                ├─> Update DB: user.isSelfVerified = true
                │
                └─> Call BenefitsPool.verifyWorker(userAddress)
                        │
                        └─> ON-CHAIN: Worker verified (isVerified = true)

User sees: ✅ "Identity Verified! You can now contribute."


┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: CONTRIBUTING TO POOL                                │
└─────────────────────────────────────────────────────────────┘

User (Browser)
    │
    ├─> Navigate to "Contribute" page
    │       │
    │       └─> See contribution options (5, 10, 20, 50 cUSD)
    │
    ├─> Enter amount (min 5 cUSD)
    │
    ├─> Click "Contribute"
    │       │
    │       ├─> Step 1: Approve cUSD spending
    │       │       │
    │       │       └─> cUSD.approve(BenefitsPool, amount)
    │       │
    │       └─> Step 2: Make contribution
    │               │
    │               └─> BenefitsPool.contribute(amount)
    │                       │
    │                       ├─> Transfer cUSD to contract
    │                       ├─> Update worker.totalContributions
    │                       └─> Update totalPoolBalance
    │
    └─> Frontend saves to database
            │
            └─> POST /api/contributions
                    │
                    └─> Save transaction history


┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: EMERGENCY WITHDRAWAL REQUEST                        │
└─────────────────────────────────────────────────────────────┘

Worker in Need
    │
    ├─> Navigate to "Request Withdrawal"
    │
    ├─> Fill form:
    │       - Amount needed
    │       - Emergency reason
    │       - Supporting documents
    │
    ├─> Click "Submit Request"
    │       │
    │       └─> BenefitsPool.requestWithdrawal(amount, reason)
    │               │
    │               ├─> Create WithdrawalRequest on-chain
    │               ├─> Start 7-day voting period
    │               └─> Emit WithdrawalRequested event
    │
    └─> Database indexer catches event
            │
            └─> POST /api/withdrawals
                    │
                    └─> Create DB record for tracking


┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: COMMUNITY VOTING                                    │
└─────────────────────────────────────────────────────────────┘

Other Verified Workers
    │
    ├─> See notification: "New withdrawal request"
    │
    ├─> Navigate to "Active Requests"
    │
    ├─> Review request details:
    │       - Amount requested
    │       - Reason for emergency
    │       - Worker's contribution history
    │       - Supporting documents
    │
    ├─> Cast vote: Approve / Deny
    │       │
    │       └─> BenefitsPool.voteOnWithdrawal(requestId, support)
    │               │
    │               ├─> Record vote on-chain
    │               ├─> Update votesFor/votesAgainst
    │               └─> Prevent double voting
    │
    └─> Vote recorded in database
            │
            └─> POST /api/votes


┌─────────────────────────────────────────────────────────────┐
│ PHASE 6: WITHDRAWAL EXECUTION                                │
└─────────────────────────────────────────────────────────────┘

After 7-day voting period:

Anyone can execute (typically the requester)
    │
    └─> Click "Execute Withdrawal"
            │
            └─> BenefitsPool.executeWithdrawal(requestId)
                    │
                    ├─> Check voting period ended
                    ├─> Calculate approval %
                    │
                    ├─> IF approved (≥60%):
                    │       │
                    │       ├─> Transfer cUSD to worker
                    │       ├─> Update pool balance
                    │       ├─> Mark as executed
                    │       └─> Emit WithdrawalExecuted
                    │
                    └─> IF rejected (<60%):
                            │
                            └─> Emit WithdrawalRejected


┌─────────────────────────────────────────────────────────────┐
│ OPTIONAL: GOODDOLLAR INTEGRATION                             │
└─────────────────────────────────────────────────────────────┘

Worker (Browser)
    │
    ├─> Navigate to "Claim UBI" widget
    │
    ├─> Check eligibility (daily claim)
    │
    ├─> Click "Claim GoodDollar"
    │       │
    │       └─> GoodDollar contract interaction
    │               │
    │               └─> Claim daily UBI (~0.01 G$)
    │
    └─> Optional: Auto-contribute checkbox
            │
            └─> IF checked:
                    │
                    ├─> Approve G$ spending
                    ├─> Swap G$ → cUSD (if needed)
                    └─> BenefitsPool.contribute(converted_amount)
```

---

## 🔧 MISSING COMPONENTS

### 1. ❌ Automated Verification System

**Current State**: Manual owner verification
**Required**: Automated Self Protocol integration

**Files Needed**:
- ✅ `/api/verify/webhook/route.ts` (EXISTS - needs testing)
- ❌ Backend wallet with gas funds for verification
- ❌ Webhook secret configuration
- ❌ Error handling & retry logic

### 2. ❌ Event Indexer

**Current State**: No blockchain event tracking
**Required**: Real-time sync between contract and database

**Implementation Needed**:
```typescript
// services/event-indexer.ts
- Listen to BenefitsPool events
- WorkerRegistered → Save to DB
- ContributionMade → Save to DB
- WithdrawalRequested → Notify voters
- VoteCast → Update vote counts
- WithdrawalExecuted → Update status
```

### 3. ❌ Notification System

**Current State**: No user notifications
**Required**: Email/Push notifications for votes

**Events Needing Notifications**:
- Verification complete
- New withdrawal request (notify voters)
- Your request was approved/rejected
- Reminder: Vote ending soon

### 4. ⚠️ GoodDollar Frontend Integration

**Current State**: Backend code exists, no UI
**Required**: Working claim widget

**Files Exist But Need Integration**:
- `components/gooddollar/claim-widget.tsx`
- `components/gooddollar/enhanced-claim-widget.tsx`
- Need to add to dashboard

---

## 🎯 CONTRACT ARCHITECTURE RECOMMENDATION

### For MVP (Current - Next 2 months):

**✅ Keep single BenefitsPool contract**

**Add**:
1. Verifier role (instead of owner-only verification)
2. Multi-sig ownership (Gnosis Safe)
3. Emergency pause mechanism

```solidity
// Recommended changes to BenefitsPool.sol:

mapping(address => bool) public authorizedVerifiers;

function addVerifier(address _verifier) external onlyOwner {
    authorizedVerifiers[_verifier] = true;
}

function verifyWorker(address _worker) external {
    require(authorizedVerifiers[msg.sender], "Not authorized verifier");
    // ... rest of function
}
```

### For Scale (1000+ users):

**Consider splitting into**:
1. `IdentityRegistry.sol` - Handle verification
2. `BenefitsPool.sol` - Handle contributions
3. `GovernanceModule.sol` - Handle voting
4. `Treasury.sol` - Hold funds

**Use proxy pattern for upgradeability** (UUPS or Transparent)

---

## 📋 IMMEDIATE ACTION ITEMS

### Critical (Do This Week):

1. **Fix Verification Flow**
   - [ ] Test Self Protocol webhook
   - [ ] Create backend verifier wallet
   - [ ] Fund wallet with CELO for gas
   - [ ] Add verifier wallet as authorized
   - [ ] Test end-to-end verification

2. **Add Verifier Role to Contract**
   ```solidity
   mapping(address => bool) public authorizedVerifiers;

   modifier onlyVerifier() {
       require(authorizedVerifiers[msg.sender], "Not authorized");
       _;
   }

   function verifyWorker(address _worker) external onlyVerifier {
       // existing logic
   }
   ```

3. **Document User Flow**
   - [ ] Add flow diagrams to README
   - [ ] Create user guide
   - [ ] Add troubleshooting section

### Important (Before Mainnet):

1. **Event Indexer**
   - Build service to sync contract events to DB
   - Real-time updates on frontend

2. **Notification System**
   - Email notifications for key events
   - Push notifications (optional)

3. **Security**
   - Multi-sig ownership
   - Emergency pause
   - Withdrawal limits

---

## ✅ ARCHITECTURE VERDICT

### Your Current Single-Contract Approach: **CORRECT ✅**

**For Proof-of-Ship and MVP**: Perfect!

**Reasons**:
- ✅ Simpler to audit
- ✅ Lower deployment cost
- ✅ Easier to manage
- ✅ Sufficient for 100-500 users
- ✅ Can always upgrade later with proxy pattern

### The Real Issue: Not Missing Contracts

**The real gaps are**:
1. ❌ Automated verification (webhook integration)
2. ❌ Event syncing (indexer)
3. ❌ Notifications
4. ❌ GoodDollar UI integration

---

## 🎬 CONCLUSION

**You DON'T need more smart contracts.**

**You DO need**:
1. Automated verification backend
2. Event indexing service
3. Better off-chain/on-chain integration
4. Complete frontend for all features

**Architecture Grade**: B+ (Good for MVP, needs operational components)

---

**Next Steps**: Focus on integration, not new contracts!
