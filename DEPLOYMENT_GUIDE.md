# Velora Mainnet Deployment Guide

**CRITICAL: Read this ENTIRE guide before deploying to mainnet!**

---

## Prerequisites

1. **Wallet with CELO tokens** on Celo Mainnet (for gas fees)
2. **Private key** from your deployment wallet (NEVER commit this!)
3. **All API keys** configured (thirdweb, Self Protocol, GoodDollar)

---

## Step 1: Deploy Smart Contract to Mainnet

### 1.1 Create contract/.env file

```bash
cd contract
```

Create a `.env` file:

```bash
# Your deployer wallet private key (KEEP SECRET!)
PRIVATE_KEY=your_private_key_here

# Set to true for mainnet deployment
DEPLOY_MAINNET=true

# Celo Mainnet RPC (optional, uses public RPC if not set)
CELO_RPC_URL=https://forno.celo.org

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_celoscan_api_key_here
```

### 1.2 Deploy to Mainnet

```bash
# Deploy BenefitsPool contract to Celo Mainnet
forge script script/Deploy.s.sol:DeployBenefitsPool \
  --rpc-url $CELO_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY

# SAVE THE DEPLOYED CONTRACT ADDRESS!
# Example output:
# BenefitsPool deployed to: 0x1234567890abcdef1234567890abcdef12345678
```

**Important:** Copy the deployed contract address - you'll need it for the frontend!

### 1.3 Verify Contract (if auto-verify failed)

```bash
# Manual verification if needed
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/BenefitsPool.sol:BenefitsPool \
  --chain-id 42220 \
  --constructor-args $(cast abi-encode "constructor(address)" 0x765DE816845861e75A25fCA122bb6898B8B1282a) \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

---

## Step 2: Configure Frontend for Mainnet

### 2.1 Create frontend/.env.local file

```bash
cd ../frontend
```

Create `.env.local`:

```bash
# === PRODUCTION CONFIGURATION ===
NODE_ENV=production

# Celo Mainnet
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CHAIN_ID=42220

# Smart Contract Addresses
NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a

# thirdweb (get from https://thirdweb.com/dashboard)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_actual_client_id
THIRDWEB_SECRET_KEY=your_actual_secret_key

# Self Protocol (get from https://self.xyz/developers)
NEXT_PUBLIC_SELF_PROTOCOL_APP_ID=your_self_app_id
SELF_PROTOCOL_SECRET=your_self_secret
NEXT_PUBLIC_SELF_SCOPE=velora-app
NEXT_PUBLIC_SELF_ENDPOINT=https://api.self.xyz

# GoodDollar
NEXT_PUBLIC_GOODDOLLAR_ENV=production

# Database (use your production database)
DATABASE_URL=postgresql://user:password@host:5432/velora_production

# Application URL (update after Vercel deployment)
NEXT_PUBLIC_APP_URL=https://velora.vercel.app
```

### 2.2 Test Locally with Mainnet Config

```bash
# Install dependencies
npm install

# Test the build
npm run build

# Run locally to test
npm run dev
```

**IMPORTANT:** Test these features before deploying:
- ✅ Wallet connection works
- ✅ Self Protocol verification works
- ✅ GoodDollar claiming works
- ✅ Contract interactions work (register, contribute)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Deploy to Production

```bash
# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? velora
# - In which directory is your code located? ./
# - Want to override the settings? N
```

### 3.4 Add Environment Variables to Vercel

```bash
# Add all .env.local variables to Vercel
vercel env add NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID
vercel env add THIRDWEB_SECRET_KEY
vercel env add NEXT_PUBLIC_SELF_PROTOCOL_APP_ID
vercel env add SELF_PROTOCOL_SECRET
vercel env add DATABASE_URL
# ... add all other variables

# Or use Vercel dashboard: https://vercel.com/your-project/settings/environment-variables
```

### 3.5 Redeploy with Environment Variables

```bash
vercel --prod
```

**Save your deployment URL!** Example: `https://velora.vercel.app`

---

## Step 4: Verify Deployment

### 4.1 Check Contract on CeloScan

Visit: `https://celoscan.io/address/YOUR_CONTRACT_ADDRESS`

Verify:
- ✅ Contract is verified (green checkmark)
- ✅ Read/Write functions are visible
- ✅ cUSD address is correct: `0x765DE816845861e75A25fCA122bb6898B8B1282a`

### 4.2 Test Frontend on Production

Visit your Vercel URL and test:

1. **Wallet Connection**
   - Connect MetaMask/Coinbase Wallet
   - Should show Celo Mainnet
   - Should display cUSD balance

2. **Worker Registration**
   - Click "Register as Worker"
   - Transaction should go to Celo Mainnet
   - Check on CeloScan

3. **Self Protocol Verification**
   - Click "Verify Identity"
   - Complete Self Protocol flow
   - Should mark as verified

4. **GoodDollar Claiming**
   - Try claiming GoodDollar
   - Should connect to mainnet contract

5. **Make Contribution**
   - Try making a small contribution (5 cUSD)
   - Check transaction on CeloScan

---

## Step 5: Update Documentation

### 5.1 Update README.md

Add to the top of README:

```markdown
## 🚀 Live Deployment

- **Live App:** https://velora.vercel.app
- **Smart Contract:** https://celoscan.io/address/YOUR_CONTRACT_ADDRESS
- **Network:** Celo Mainnet (Chain ID: 42220)
```

### 5.2 Commit and Push

```bash
git add .
git commit -m "Deploy to Celo Mainnet for Proof-of-Ship

- Deployed BenefitsPool contract to mainnet
- Updated configuration for production
- Deployed frontend to Vercel
- Ready for Proof-of-Ship submission"

git push origin main
```

---

## Step 6: Submit to Proof-of-Ship

### 6.1 Create KarmaGAP Profile

1. Go to https://gap.karmahq.xyz/community/celo
2. Click "Create Project"
3. Fill in details:
   - **Name:** Velora
   - **Description:** Mutual aid platform for gig workers
   - **GitHub:** Link your repo
   - **Contract Address:** YOUR_DEPLOYED_CONTRACT
   - **Demo URL:** https://velora.vercel.app

### 6.2 Add Milestones

Add these milestones to KarmaGAP:
- ✅ Smart contract deployed and verified
- ✅ Self Protocol integration working
- ✅ GoodDollar integration working
- ✅ Frontend deployed to production
- ✅ First worker registered on mainnet

### 6.3 Add Track Tags

In your KarmaGAP profile, add:
- **Tag:** `self-protocol` (for $5k track)
- **Tag:** `gooddollar` (for $1.5k track)

---

## Troubleshooting

### Contract Deployment Fails

```bash
# Check CELO balance
cast balance YOUR_WALLET_ADDRESS --rpc-url https://forno.celo.org

# If low, get CELO from exchange and send to wallet
```

### Verification Fails

```bash
# Try manual verification with flattened contract
forge flatten src/BenefitsPool.sol > flattened.sol

# Then verify on celoscan.io manually
```

### Frontend Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Self Protocol Not Working

1. Check API keys are correct
2. Verify endpoint is production: `https://api.self.xyz`
3. Check wallet is on Celo Mainnet

---

## Post-Deployment Checklist

- [ ] Contract deployed to Celo Mainnet
- [ ] Contract verified on CeloScan
- [ ] Frontend deployed to Vercel
- [ ] All integrations tested on mainnet
- [ ] README updated with live URLs
- [ ] Demo video recorded
- [ ] KarmaGAP profile created
- [ ] Track tags added
- [ ] Submitted before Dec 8, 9 AM GMT

---

## Support

If you encounter issues:
1. Check contract on CeloScan
2. Check Vercel deployment logs
3. Ask in Celo Proof-of-Ship Telegram: https://t.me/proofofship

**Good luck with your deployment! 🚀**
