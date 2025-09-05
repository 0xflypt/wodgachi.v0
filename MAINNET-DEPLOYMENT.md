# 🌐 XDC Mainnet Deployment Guide

## ⚠️ CRITICAL: Mainnet Deployment Checklist

**BEFORE deploying to mainnet, ensure you have:**
- [ ] Thoroughly tested all contracts on XDC Apothem testnet
- [ ] At least 50-100 XDC tokens for deployment costs
- [ ] Verified all contract functionality works correctly
- [ ] Backed up your private key securely
- [ ] Double-checked all contract addresses and parameters

## 🚀 Step-by-Step Mainnet Deployment

### Step 1: Get XDC Mainnet Tokens
1. **Purchase XDC tokens** from exchanges like:
   - KuCoin
   - Bitfinex
   - AscendEX
   - Gate.io

2. **Transfer XDC to your deployment wallet**
   - Minimum recommended: 50 XDC
   - Deployment typically costs 10-20 XDC total

### Step 2: Configure MetaMask for XDC Mainnet
Add XDC Network to MetaMask:
```
Network Name: XDC Network
New RPC URL: https://rpc.xinfin.network
Chain ID: 50
Currency Symbol: XDC
Block Explorer URL: https://explorer.xinfin.network
```

### Step 3: Deploy Using Remix IDE (Recommended)

#### 3.1: Open Remix and Load Contracts
1. Go to https://remix.ethereum.org/
2. Upload all your contract files:
   - `WODgachiToken.sol`
   - `WODgachiNFT.sol`
   - `FitnessOracle.sol`
   - `WODgachiCore.sol`
   - `WODgachiRewards.sol`
   - `interfaces/IFitnessOracle.sol`

#### 3.2: Compile Contracts
1. Go to "Solidity Compiler" tab
2. Select compiler version: `0.8.19`
3. Enable optimization: 200 runs
4. Compile all contracts
5. Verify no compilation errors

#### 3.3: Connect to XDC Mainnet
1. Go to "Deploy & Run Transactions" tab
2. Select "Injected Provider - MetaMask"
3. Ensure MetaMask is on XDC Network (Chain ID: 50)
4. Verify your XDC balance is sufficient

#### 3.4: Deploy Contracts in Order

**Deploy in this EXACT order:**

1. **Deploy WODgachiToken**
   ```
   Contract: WODgachiToken
   Constructor: (no parameters)
   ```
   ✅ Save address as: `CRUSH_TOKEN_ADDRESS`

2. **Deploy WODgachiNFT**
   ```
   Contract: WODgachiNFT
   Constructor: (no parameters)
   ```
   ✅ Save address as: `PROGRESS_NFT_ADDRESS`

3. **Deploy FitnessOracle**
   ```
   Contract: FitnessOracle
   Constructor: (no parameters)
   ```
   ✅ Save address as: `FITNESS_ORACLE_ADDRESS`

4. **Deploy WODgachiCore**
   ```
   Contract: WODgachiCore
   Constructor parameters:
   - _crushToken: CRUSH_TOKEN_ADDRESS
   - _progressNFT: PROGRESS_NFT_ADDRESS
   - _fitnessOracle: FITNESS_ORACLE_ADDRESS
   ```
   ✅ Save address as: `CORE_CONTRACT_ADDRESS`

5. **Deploy WODgachiRewards**
   ```
   Contract: WODgachiRewards
   Constructor parameters:
   - _crushToken: CRUSH_TOKEN_ADDRESS
   - _progressNFT: PROGRESS_NFT_ADDRESS
   ```
   ✅ Save address as: `REWARDS_CONTRACT_ADDRESS`

### Step 4: Configure Contract Permissions

**CRITICAL: Execute these transactions in order:**

#### 4.1: Authorize Core Contract to Mint CRUSH Tokens
```
Contract: WODgachiToken
Function: authorizeMinter
Parameter: CORE_CONTRACT_ADDRESS
```

#### 4.2: Authorize Core Contract to Mint NFTs
```
Contract: WODgachiNFT
Function: authorizeMinter
Parameter: CORE_CONTRACT_ADDRESS
```

#### 4.3: Setup Oracle Permissions
```
Contract: FitnessOracle
Function: addOracleNode
Parameter: YOUR_WALLET_ADDRESS

Contract: FitnessOracle
Function: authorizeCaller
Parameter: CORE_CONTRACT_ADDRESS
```

#### 4.4: Add Valid Workout IDs
```
Contract: WODgachiCore
Function: addValidWorkout
Parameters (call 4 times):
- "hiit-cardio-blast"
- "strength-upper-body"
- "core-crusher"
- "leg-day-beast"
```

### Step 5: Update Frontend Configuration

Create production `.env` file:
```env
# XDC Mainnet Contract Addresses
VITE_CRUSH_TOKEN_ADDRESS=0x...
VITE_PROGRESS_NFT_ADDRESS=0x...
VITE_FITNESS_ORACLE_ADDRESS=0x...
VITE_CORE_CONTRACT_ADDRESS=0x...
VITE_REWARDS_CONTRACT_ADDRESS=0x...

# XDC Network Configuration
VITE_XDC_MAINNET_RPC=https://rpc.xinfin.network
VITE_XDC_MAINNET_CHAIN_ID=50
VITE_XDC_TESTNET_RPC=https://rpc.apothem.network
VITE_XDC_TESTNET_CHAIN_ID=51
```

### Step 6: Verify Deployment

#### 6.1: Test Core Functions
1. **Register a test user:**
   ```
   Contract: WODgachiCore
   Function: registerUser
   Parameters: "TestUser", "TestHammy"
   ```

2. **Submit a test workout:**
   ```
   Contract: WODgachiCore
   Function: submitWorkout
   Parameters: "hiit-cardio-blast", 30, 2
   ```

3. **Check CRUSH balance:**
   ```
   Contract: WODgachiToken
   Function: balanceOf
   Parameter: YOUR_WALLET_ADDRESS
   ```

#### 6.2: Verify on XDC Explorer
Visit https://explorer.xinfin.network/ and search for each contract address to verify:
- Contract creation transactions
- Function calls are working
- Token transfers are occurring

### Step 7: Production Monitoring

#### 7.1: Set Up Monitoring
- Monitor contract interactions on XDC Explorer
- Track CRUSH token supply and distribution
- Monitor NFT minting at 30-workout milestones
- Watch for any failed transactions

#### 7.2: Oracle Node Setup
For production, set up dedicated oracle nodes:
```javascript
// Example oracle node script
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://rpc.xinfin.network');
const wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);

// Monitor fitness data and submit to oracle
async function submitFitnessData(userAddress, workoutId, heartRate, calories, steps) {
  const oracle = new ethers.Contract(ORACLE_ADDRESS, ORACLE_ABI, wallet);
  await oracle.submitFitnessData(userAddress, workoutId, heartRate, calories, steps);
}
```

## 🔒 Security Best Practices

### Smart Contract Security
- [ ] All contracts have been audited
- [ ] Access controls are properly implemented
- [ ] No reentrancy vulnerabilities
- [ ] Proper input validation

### Operational Security
- [ ] Private keys stored securely (hardware wallet recommended)
- [ ] Multi-signature wallet for contract ownership
- [ ] Regular security monitoring
- [ ] Incident response plan

## 💰 Cost Estimation

**Estimated deployment costs on XDC Mainnet:**
- WODgachiToken: ~2-3 XDC
- WODgachiNFT: ~3-4 XDC
- FitnessOracle: ~2-3 XDC
- WODgachiCore: ~4-5 XDC
- WODgachiRewards: ~3-4 XDC
- Configuration transactions: ~2-3 XDC
- **Total: ~16-22 XDC**

## 🚨 Emergency Procedures

### If Deployment Fails
1. Check gas limits and increase if needed
2. Verify all constructor parameters are correct
3. Ensure sufficient XDC balance
4. Check network connectivity

### If Contracts Need Updates
1. Deploy new versions with updated logic
2. Migrate data if necessary
3. Update frontend to use new addresses
4. Communicate changes to users

## ✅ Post-Deployment Checklist

- [ ] All 5 contracts deployed successfully
- [ ] All permissions configured correctly
- [ ] Test transactions completed successfully
- [ ] Frontend updated with mainnet addresses
- [ ] Monitoring systems active
- [ ] Documentation updated
- [ ] Team notified of mainnet launch

## 🎉 You're Live on XDC Mainnet!

Congratulations! Your WODgachi fitness ecosystem is now running on XDC Network mainnet. Users can now:
- Earn real CRUSH tokens for workouts
- Mint progress NFTs on-chain
- Redeem rewards with tokens or NFTs
- Compete on global leaderboards
- Secure their fitness journey on blockchain

**Welcome to the future of GameFi fitness!** 🚀💪⛓️