# Single Network Configuration - Celo Sepolia Only

**Network**: Celo Sepolia Testnet  
**Chain ID**: 11142220  
**No Network Switching**: Users must be on Celo Sepolia

---

## ✅ Configuration Applied

Your Velora app is now configured to **only work with Celo Sepolia testnet**. Users cannot switch networks and will be prompted to switch if they're on the wrong network.

### Changes Made:

1. **Removed Celo Mainnet** from supported networks
2. **Disabled network switching UI** in the wallet modal
3. **Set `allowUnsupportedChain: false`** to reject other networks
4. **Single network in config** - only Celo Sepolia

---

## 🔧 Configuration Details

### Networks Supported
```typescript
// Only Celo Sepolia
export const networks = [celoSepolia]
```

### Network Details
| Property | Value |
|----------|-------|
| **Network Name** | Celo Sepolia Testnet |
| **Chain ID** | 11142220 |
| **RPC URL** | https://rpc.ankr.com/celo_sepolia |
| **Currency** | CELO |
| **Explorer** | https://sepolia.celoscan.io |

### AppKit Configuration
```typescript
{
  networks: [celoSepolia],
  defaultNetwork: celoSepolia,
  allowUnsupportedChain: false, // Reject other networks
  enableNetworkView: false, // Hide network switcher
}
```

---

## 🎯 User Experience

### What Users See:

1. **Connect Wallet**
   - User clicks "Connect Wallet"
   - Modal opens with wallet options

2. **Wrong Network Detection**
   - If user is on wrong network (e.g., Ethereum, Polygon)
   - App shows "Unsupported Network" message
   - User is prompted to switch to Celo Sepolia

3. **Correct Network**
   - If user is on Celo Sepolia
   - Connection succeeds immediately
   - No network switcher shown

4. **No Network Switching**
   - Network switcher is hidden
   - Users cannot accidentally switch networks
   - App only works on Celo Sepolia

---

## 📱 Adding Celo Sepolia to Wallet

If users don't have Celo Sepolia in their wallet:

### MetaMask
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Click "Add a network manually"
5. Enter:
   - **Network Name**: Celo Sepolia Testnet
   - **RPC URL**: https://rpc.ankr.com/celo_sepolia
   - **Chain ID**: 11142220
   - **Currency Symbol**: CELO
   - **Block Explorer**: https://sepolia.celoscan.io

### Coinbase Wallet
1. Open Coinbase Wallet
2. Go to Settings → Networks
3. Click "Add Network"
4. Enter same details as above

### Other Wallets
Most wallets support custom networks. Use the same details above.

---

## 🔍 How It Works

### Network Validation

```typescript
// When user connects
if (chainId !== 11142220) {
  // Show "Switch to Celo Sepolia" prompt
  // User must switch to continue
}
```

### Automatic Network Check

The app automatically:
1. Checks user's current network
2. Compares with allowed networks (only Celo Sepolia)
3. If mismatch, shows switch prompt
4. If match, allows connection

---

## 🛠️ Files Modified

1. **`config/reown.ts`**
   ```typescript
   // Before: [celoSepolia, celoMainnet]
   // After:  [celoSepolia]
   export const networks = [celoSepolia]
   ```

2. **`config/wallet.ts`**
   ```typescript
   // Before: [celoSepolia, celoMainnet]
   // After:  [celoSepolia]
   export const networks = [celoSepolia]
   
   // Removed mainnet transport
   transports: {
     [celoSepolia.id]: http('https://rpc.ankr.com/celo_sepolia'),
   }
   ```

3. **`context/ReownProvider.tsx`**
   ```typescript
   // Added:
   allowUnsupportedChain: false,
   enableNetworkView: false,
   ```

---

## ✅ Benefits

### For Users
- ✅ **No confusion** - Only one network to worry about
- ✅ **No accidental switches** - Can't switch to wrong network
- ✅ **Clear guidance** - Prompted to switch if on wrong network
- ✅ **Simpler UX** - No network selector cluttering UI

### For Developers
- ✅ **Single deployment** - Only deploy to Celo Sepolia
- ✅ **Easier testing** - One network to test
- ✅ **No multi-chain bugs** - Can't have cross-chain issues
- ✅ **Simpler config** - Less configuration to manage

---

## 🧪 Testing

### Test Scenarios

1. **User on Celo Sepolia**
   - ✅ Should connect immediately
   - ✅ No network prompt

2. **User on Ethereum Mainnet**
   - ✅ Should show "Unsupported Network"
   - ✅ Should prompt to switch
   - ✅ After switch, should connect

3. **User on Polygon**
   - ✅ Should show "Unsupported Network"
   - ✅ Should prompt to switch

4. **User without Celo Sepolia**
   - ✅ Should show instructions to add network
   - ✅ Should provide network details

---

## 🔄 If You Want to Add More Networks Later

To add more networks in the future:

1. **Update `config/reown.ts`**
   ```typescript
   export const networks = [celoSepolia, celoMainnet]
   ```

2. **Update `config/wallet.ts`**
   ```typescript
   export const networks = [celoSepolia, celoMainnet]
   
   transports: {
     [celoSepolia.id]: http('https://rpc.ankr.com/celo_sepolia'),
     [celoMainnet.id]: http('https://forno.celo.org'),
   }
   ```

3. **Update `context/ReownProvider.tsx`**
   ```typescript
   allowUnsupportedChain: false, // Keep this
   enableNetworkView: true, // Enable network switcher
   ```

---

## 📊 Network Information

### Celo Sepolia Testnet

**Purpose**: Testing and development

**Features**:
- Free test CELO from faucet
- Same features as mainnet
- Safe for testing
- No real money

**Faucet**: https://faucet.celo.org/sepolia

**Explorer**: https://sepolia.celoscan.io

**RPC Endpoints**:
- Primary: https://rpc.ankr.com/celo_sepolia
- Alternative: https://sepolia-forno.celo-testnet.org

---

## 🐛 Troubleshooting

### Issue: "Unsupported Network" error

**Solution**: User needs to switch to Celo Sepolia
1. Open wallet
2. Click network dropdown
3. Select "Celo Sepolia Testnet"
4. If not available, add it manually (see above)

### Issue: Can't add Celo Sepolia to wallet

**Solution**: Add manually with these details:
- Network Name: Celo Sepolia Testnet
- RPC URL: https://rpc.ankr.com/celo_sepolia
- Chain ID: 11142220
- Currency: CELO
- Explorer: https://sepolia.celoscan.io

### Issue: Network switcher still showing

**Solution**: 
1. Clear browser cache
2. Restart dev server
3. Check `enableNetworkView: false` in ReownProvider.tsx

---

## 📝 Summary

**Configuration**: Single network only (Celo Sepolia)

**Benefits**:
- Simpler user experience
- No accidental network switches
- Easier to manage
- Perfect for testnet-only deployment

**User Flow**:
1. Connect wallet
2. If wrong network → prompted to switch
3. If correct network → connected immediately
4. No network switcher shown

---

**Status**: ✅ Configured for Celo Sepolia Only

**Network Switching**: ❌ Disabled

**Ready for**: Testing on Celo Sepolia testnet
