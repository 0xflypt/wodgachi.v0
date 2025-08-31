# 🚀 WODgachi XDC Testnet Deployment Guide

## Prerequisites

### 1. Install Dependencies
```bash
npm install
```

### 2. Get XDC Testnet Tokens
1. Visit the XDC Apothem Testnet Faucet: https://faucet.apothem.network/
2. Enter your wallet address
3. Request testnet XDC tokens
4. Wait for confirmation (usually 1-2 minutes)

### 3. Setup Environment Variables
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your private key to `.env`:
```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

⚠️ **IMPORTANT**: Never commit your `.env` file or share your private key!

## 🧪 Step-by-Step Testnet Deployment

### Step 1: Compile Contracts
```bash
npx hardhat compile
```

Expected output:
```
Compiled 6 Solidity files successfully
```

### Step 2: Run Tests (Optional but Recommended)
```bash
npx hardhat test
```

This ensures all contracts work correctly before deployment.

### Step 3: Deploy to XDC Apothem Testnet
```bash
npx hardhat run scripts/deploy-testnet.js --network apothem
```

Expected output:
```
🧪 Deploying WODgachi contracts to XDC Apothem Testnet...
Deploying contracts with account: 0x...
Account balance: 100.0 XDC

📄 Deploying WODgachi CRUSH Token...
✅ CRUSH Token deployed to: 0x...

🎨 Deploying WODgachi Progress NFT...
✅ Progress NFT deployed to: 0x...

🔮 Deploying Fitness Oracle...
✅ Fitness Oracle deployed to: 0x...

🏗️ Deploying WODgachi Core...
✅ Core Contract deployed to: 0x...

🎁 Deploying WODgachi Rewards...
✅ Rewards Contract deployed to: 0x...

⚙️ Setting up contract permissions...
✅ Core contract authorized to mint CRUSH tokens
✅ Core contract authorized to mint NFTs
✅ Deployer added as oracle node
✅ Core contract authorized to call oracle

📋 Adding valid workout IDs...
✅ Added valid workout: hiit-cardio-blast
✅ Added valid workout: strength-upper-body
✅ Added valid workout: core-crusher
✅ Added valid workout: leg-day-beast

🎉 Testnet deployment completed successfully!
```

### Step 4: Save Contract Addresses
Copy the contract addresses from the deployment output and update your frontend `.env` file:

```env
VITE_CRUSH_TOKEN_ADDRESS=0x...
VITE_PROGRESS_NFT_ADDRESS=0x...
VITE_FITNESS_ORACLE_ADDRESS=0x...
VITE_CORE_CONTRACT_ADDRESS=0x...
VITE_REWARDS_CONTRACT_ADDRESS=0x...
```

### Step 5: Setup Oracle Nodes (Optional)
```bash
npx hardhat run scripts/setup-oracle.js --network apothem
```

### Step 6: Verify Contracts on XDC Explorer
```bash
npx hardhat verify --network apothem <CONTRACT_ADDRESS>
```

Replace `<CONTRACT_ADDRESS>` with each deployed contract address.

## 🧪 Testing the Deployment

### Test 1: Register User
```bash
npx hardhat console --network apothem
```

In the console:
```javascript
const core = await ethers.getContractAt("WODgachiCore", "YOUR_CORE_CONTRACT_ADDRESS");
await core.registerUser("TestUser", "Hammy");
```

### Test 2: Submit Workout
```javascript
await core.submitWorkout("hiit-cardio-blast", 30, 2);
```

### Test 3: Check CRUSH Balance
```javascript
const crush = await ethers.getContractAt("WODgachiToken", "YOUR_CRUSH_TOKEN_ADDRESS");
const balance = await crush.balanceOf("YOUR_ADDRESS");
console.log("CRUSH Balance:", ethers.utils.formatEther(balance));
```

## 💰 Testnet Payment Options

For testing convenience, the rewards system accepts TWO payment methods:

### Option 1: CRUSH Tokens (Normal)
- Earn CRUSH by completing workouts
- 150 CRUSH per workout + streak bonuses

### Option 2: XDC Tokens (Testnet Only)
- Use testnet XDC directly for rewards
- Exchange rate: 1000 CRUSH = 1 XDC
- Example: Premium Workout (500 CRUSH) = 0.5 XDC

### Testing Reward Redemption with XDC:
```javascript
const rewards = await ethers.getContractAt("WODgachiRewards", "YOUR_REWARDS_ADDRESS");

// Check XDC cost for a reward
const xdcCost = await rewards.getRewardCostInXDC("premium-workout");
console.log("XDC Cost:", ethers.utils.formatEther(xdcCost));

// Redeem with XDC (send XDC value with transaction)
await rewards.redeemWithCRUSH("premium-workout", { value: xdcCost });
```

## 🔍 Verify Deployment

### Check on XDC Apothem Explorer:
- Visit: https://explorer.apothem.network/
- Search for your contract addresses
- Verify transactions and contract interactions

### Frontend Integration:
Your existing React app will automatically work with the deployed contracts once you update the environment variables.

## 🌐 Mainnet Deployment (When Ready)

After successful testnet testing:

```bash
npx hardhat run scripts/deploy-mainnet.js --network xdc
```

⚠️ **WARNING**: Mainnet deployment uses real XDC tokens!

## 🏆 Vibeathon Submission Checklist

✅ XDC Network Integration (Testnet + Mainnet ready)
✅ Smart Contracts (5 comprehensive contracts)
✅ Oracle Integration (Fitness data verification)
✅ Mainnet Deployment Scripts (Ready to deploy)
✅ Additional Innovation (GameFi + DeFi + NFTs)

Your WODgachi app is now ready for XDC Network with full blockchain integration! 🎉