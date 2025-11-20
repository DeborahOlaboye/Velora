# Integration Testing Guide

**Quick Start**: Test all three integrations (Self Protocol, GoodDollar, Gasless Transactions)

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Environment Configuration

Create `.env.local` in the `frontend` directory:

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

**Minimum Required Variables:**
```bash
# thirdweb (Get from https://thirdweb.com/dashboard)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# Celo Network
NEXT_PUBLIC_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_CHAIN_ID=44787

# Smart Contracts (Update after deployment)
NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS=your_deployed_contract
NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/velora

# Self Protocol (Optional for initial testing)
NEXT_PUBLIC_SELF_PROTOCOL_APP_ID=test_app_id
NEXT_PUBLIC_SELF_SCOPE=velora-test
NEXT_PUBLIC_SELF_ENDPOINT=https://api.staging.self.xyz

# GoodDollar (Optional for initial testing)
NEXT_PUBLIC_GOODDOLLAR_ENV=development
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
```

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

### Step 3: Set Up Database

```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Step 4: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🧪 Testing Each Integration

### Test 1: Gasless Transactions (Easiest to Test)

#### Prerequisites
- thirdweb client ID configured
- Contract deployed to Celo Alfajores
- Wallet with some test CELO

#### Test Steps

1. **Connect Wallet**
   ```
   - Go to http://localhost:3000
   - Click "Connect Wallet"
   - Connect with MetaMask or any wallet
   ```

2. **Test Gasless Registration**
   ```typescript
   // In browser console or test component:
   import { registerWorkerGasless } from '@/lib/gasless';
   
   const result = await registerWorkerGasless(account);
   console.log('Registration result:', result);
   
   // Expected output:
   // {
   //   success: true,
   //   transactionHash: "0x...",
   //   gasless: true,
   //   gasSaved: "0.001234"
   // }
   ```

3. **Verify Gas Sponsorship**
   ```
   - Check thirdweb dashboard
   - Look for transaction in "Gasless" section
   - Verify gas was sponsored
   ```

#### Expected Results
- ✅ Transaction succeeds
- ✅ No gas fee charged to user
- ✅ Transaction appears in thirdweb dashboard
- ✅ `gasless: true` in response

#### Troubleshooting
- **Error: "Contract address not configured"**
  - Set `NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS`
  
- **Error: "Insufficient funds"**
  - Get test CELO from [Celo Faucet](https://faucet.celo.org/)
  
- **Gas not sponsored**
  - Check thirdweb dashboard configuration
  - Verify contract address is whitelisted
  - Check sponsorship budget

---

### Test 2: Self Protocol Verification

#### Prerequisites
- Self Protocol app registered
- Webhook URL configured
- Self mobile app installed

#### Test Steps

1. **Initiate Verification**
   ```
   - Go to /register page
   - Click "Verify Identity"
   - QR code should appear
   ```

2. **Scan QR Code**
   ```
   - Open Self app on mobile
   - Scan QR code
   - Complete verification flow
   - Submit documents
   ```

3. **Wait for Webhook**
   ```
   - Webhook should be received within 1-2 minutes
   - Check server logs for webhook event
   - Database should update automatically
   ```

4. **Verify On-Chain**
   ```
   - Check if verifyWorker was called
   - Look for WorkerVerified event
   - Verify user status in database
   ```

#### Test Webhook Locally

Use ngrok to expose local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose port 3000
ngrok http 3000

# Copy ngrok URL (e.g., https://abc123.ngrok.io)
# Configure in Self Protocol dashboard:
# Webhook URL: https://abc123.ngrok.io/api/verify/webhook
```

Test webhook manually:

```bash
curl -X POST http://localhost:3000/api/verify/webhook \
  -H "Content-Type: application/json" \
  -H "x-self-signature: test_signature" \
  -d '{
    "event": "verification.completed",
    "data": {
      "userId": "0x1234567890123456789012345678901234567890",
      "selfUserId": "self_user_123",
      "verified": true,
      "verificationData": {}
    }
  }'
```

#### Expected Results
- ✅ QR code displays
- ✅ Mobile app can scan
- ✅ Webhook received
- ✅ Database updated
- ✅ Smart contract called
- ✅ User sees success message

#### Troubleshooting
- **QR code not showing**
  - Check Self Protocol configuration
  - Verify app ID and scope
  
- **Webhook not received**
  - Check webhook URL is accessible
  - Verify ngrok is running (for local testing)
  - Check Self Protocol dashboard logs
  
- **On-chain verification fails**
  - Check verifier wallet has CELO
  - Verify wallet has owner/verifier role
  - Check contract address is correct

---

### Test 3: GoodDollar Integration

#### Prerequisites
- Reown project ID configured
- GoodDollar face verification complete (for claiming)
- Wallet connected

#### Test Steps

1. **Check Claim Eligibility**
   ```typescript
   import { canClaimGoodDollar } from '@/lib/gooddollar';
   
   const status = await canClaimGoodDollar(walletAddress, 'celo');
   console.log('Claim status:', status);
   
   // Expected output:
   // {
   //   canClaim: true,
   //   nextClaimTime: Date,
   //   claimAmount: "0.01"
   // }
   ```

2. **Display Claim Widget**
   ```
   - Go to dashboard
   - GoodDollar widget should show
   - Balance should display
   - Claim button enabled if eligible
   ```

3. **Test Claim (Simulated)**
   ```
   - Click "Claim" button
   - Check "Auto-contribute" checkbox
   - Confirm transaction
   - Wait for confirmation
   ```

4. **Verify Recording**
   ```
   - Check database for claim record
   - Verify contribution if auto-contribute enabled
   - Check activity log
   ```

#### Test API Endpoints

```bash
# Check claim status
curl http://localhost:3000/api/gooddollar/claim?walletAddress=0x123...&network=celo

# Record a claim
curl -X POST http://localhost:3000/api/gooddollar/claim \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "amount": "0.01",
    "txHash": "0xabc...",
    "autoContribute": true
  }'
```

#### Expected Results
- ✅ Claim eligibility checked
- ✅ Balance displays correctly
- ✅ Claim button works
- ✅ Auto-contribute option available
- ✅ Claim recorded in database
- ✅ Contribution tracked (if enabled)

#### Troubleshooting
- **Can't claim**
  - User may not be face-verified
  - May have already claimed today
  - Check network (Celo vs Fuse)
  
- **Balance shows 0**
  - User may not have claimed before
  - Check correct network
  - Verify contract address
  
- **Auto-contribute fails**
  - Check cUSD balance
  - Verify approval
  - Check contract address

---

## 🔄 End-to-End Test Flow

Test the complete user journey:

### 1. New User Registration

```
1. User connects wallet
2. User verifies identity (Self Protocol)
   - Scan QR code
   - Complete verification
   - Wait for webhook
   - Database updates
   - Smart contract verifies
3. User registers as worker (Gasless)
   - Click "Register"
   - Transaction sponsored
   - No gas fee
4. User claims GoodDollar
   - Check eligibility
   - Claim G$
   - Auto-contribute enabled
5. User makes contribution
   - Enter amount
   - Approve cUSD
   - Contribute (gasless if small amount)
```

### 2. Existing User Flow

```
1. User connects wallet
2. User claims daily GoodDollar
   - Auto-contribute to pool
3. User votes on withdrawal request
   - Gasless voting
   - No gas fee
4. User checks dashboard
   - See contributions
   - See voting history
   - See GoodDollar claims
```

---

## 📊 Test Checklist

### Self Protocol
- [ ] QR code generates correctly
- [ ] Mobile app can scan QR
- [ ] Verification completes successfully
- [ ] Webhook received and processed
- [ ] Database updated correctly
- [ ] Smart contract verifyWorker called
- [ ] User sees success message
- [ ] Failed verification handled
- [ ] Retry mechanism works

### GoodDollar
- [ ] Claim eligibility checked
- [ ] Balance displays correctly
- [ ] Claim button enabled/disabled appropriately
- [ ] Auto-contribute checkbox works
- [ ] Claim transaction succeeds
- [ ] Claim recorded in database
- [ ] Contribution tracked (if auto-contribute)
- [ ] Claim history displays
- [ ] Network switching works (Celo ↔ Fuse)

### Gasless Transactions
- [ ] Registration is gasless
- [ ] Voting is gasless
- [ ] Small contributions are gasless
- [ ] Gas savings calculated
- [ ] Transaction status updates
- [ ] Fallback to regular tx works
- [ ] Approval flow works
- [ ] Error handling works
- [ ] thirdweb dashboard shows transactions

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Start PostgreSQL
sudo service postgresql start

# Run migrations
npx prisma migrate dev
```

### Issue: "Contract not deployed"
**Solution:**
```bash
# Deploy contract to Alfajores
cd contract
forge script script/Deploy.s.sol --rpc-url $ALFAJORES_RPC --broadcast

# Update .env.local with contract address
```

### Issue: "Webhook not received"
**Solution:**
```bash
# For local testing, use ngrok
ngrok http 3000

# Update webhook URL in Self Protocol dashboard
# Test webhook manually with curl
```

### Issue: "Gas sponsorship not working"
**Solution:**
```bash
# Check thirdweb dashboard
# Verify contract is whitelisted
# Check sponsorship budget
# Verify function names match
```

---

## 📈 Monitoring During Testing

### Logs to Watch

```bash
# Frontend logs
npm run dev

# Watch for:
# - "Received Self Protocol webhook"
# - "User verification status updated"
# - "Worker verified on-chain"
# - "Claim successful"
# - "Transaction gasless: true"
```

### Database Queries

```sql
-- Check user verification status
SELECT walletAddress, isSelfVerified, selfVerifiedAt, isRegistered
FROM "User"
WHERE walletAddress = '0x...';

-- Check contributions
SELECT * FROM "Contribution"
WHERE userId = (SELECT id FROM "User" WHERE walletAddress = '0x...')
ORDER BY timestamp DESC;

-- Check activity logs
SELECT * FROM "ActivityLog"
WHERE userId = (SELECT id FROM "User" WHERE walletAddress = '0x...')
ORDER BY createdAt DESC;
```

### Smart Contract Queries

```bash
# Check if worker is verified
cast call $CONTRACT_ADDRESS "workers(address)(bool,bool,uint256,uint256,uint256,uint256,uint256)" $WALLET_ADDRESS --rpc-url $RPC_URL

# Check pool stats
cast call $CONTRACT_ADDRESS "getPoolStats()(uint256,uint256,uint256)" --rpc-url $RPC_URL
```

---

## ✅ Success Criteria

All tests pass when:

1. **Self Protocol**
   - Verification completes in < 2 minutes
   - Webhook received within 30 seconds
   - Database updates correctly
   - Smart contract verifies worker
   - Success rate > 90%

2. **GoodDollar**
   - Claim eligibility checked correctly
   - Claims succeed when eligible
   - Auto-contribute works
   - Database records all claims
   - Success rate > 95%

3. **Gasless Transactions**
   - Eligible actions are gasless
   - Gas savings calculated
   - Fallback works when needed
   - Transaction success rate > 95%
   - Budget utilization < 80%

---

## 🎯 Next Steps After Testing

1. **Fix any issues found**
2. **Document edge cases**
3. **Update error messages**
4. **Add more test cases**
5. **Prepare for beta testing**
6. **Set up monitoring**
7. **Create user documentation**

---

**Ready to test?** Start with gasless transactions (easiest), then Self Protocol, then GoodDollar!

**Need help?** Check the detailed implementation files or the INTEGRATION_COMPLETION_SUMMARY.md document.
