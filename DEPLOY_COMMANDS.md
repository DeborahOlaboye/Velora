# Quick Deployment Commands

## 🚀 Deploy to Celo Mainnet (Copy & Paste)

### 1. Deploy Smart Contract

```bash
cd contract

# Create .env file
cat > .env << 'EOF'
PRIVATE_KEY=your_private_key_here
DEPLOY_MAINNET=true
CELO_RPC_URL=https://forno.celo.org
ETHERSCAN_API_KEY=your_celoscan_api_key
EOF

# Deploy
forge script script/Deploy.s.sol:DeployBenefitsPool \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify

# ⚠️ SAVE THE CONTRACT ADDRESS FROM OUTPUT!
```

### 2. Configure Frontend

```bash
cd ../frontend

# Create .env.local
cat > .env.local << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CHAIN_ID=42220
NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret
NEXT_PUBLIC_SELF_PROTOCOL_APP_ID=your_app_id
SELF_PROTOCOL_SECRET=your_secret
NEXT_PUBLIC_GOODDOLLAR_ENV=production
DATABASE_URL=your_database_url
EOF

# Test build
npm run build

# Test locally
npm run dev
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# ⚠️ SAVE THE DEPLOYMENT URL!
```

### 4. Update README

```bash
# Add to top of README.md:
cat >> ../README.md << 'EOF'

## 🚀 Live Deployment

- **Live App:** https://your-app.vercel.app
- **Smart Contract:** https://celoscan.io/address/YOUR_CONTRACT
- **Network:** Celo Mainnet (Chain ID: 42220)
EOF
```

### 5. Commit & Push

```bash
git add .
git commit -m "Deploy to Celo Mainnet - Ready for Proof-of-Ship"
git push origin main
```

---

## 📊 Verify Deployment

```bash
# Check contract on CeloScan
open https://celoscan.io/address/YOUR_CONTRACT_ADDRESS

# Check frontend
open https://your-app.vercel.app

# Test wallet connection, registration, and contributions
```

---

## 🎯 Submit to Proof-of-Ship

1. **KarmaGAP:** https://gap.karmahq.xyz/community/celo
2. **Add tags:** `self-protocol`, `gooddollar`
3. **Deadline:** December 8, 9 AM GMT

---

## ✅ Pre-Deployment Checklist

- [ ] Have CELO tokens in deployment wallet (for gas)
- [ ] Have all API keys ready (thirdweb, Self, GoodDollar)
- [ ] Tested contract deployment on testnet
- [ ] Frontend builds without errors
- [ ] Database is configured
- [ ] Wallet has permissions for contract verification

---

## 🆘 Quick Fixes

### Build fails?
```bash
rm -rf .next node_modules
npm install
npm run build
```

### No CELO for gas?
```bash
# Buy CELO on exchange (Coinbase, Binance)
# Send to your deployment wallet
```

### Verification fails?
```bash
# Get Celoscan API key: https://celoscan.io/myapikey
# Add to contract/.env
forge verify-contract YOUR_ADDRESS src/BenefitsPool.sol:BenefitsPool --chain-id 42220
```

---

**Need help?** Check DEPLOYMENT_GUIDE.md for detailed instructions.
