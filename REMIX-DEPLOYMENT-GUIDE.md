# 🚀 Complete XDC Testnet Deployment Guide using Remix IDE

This guide will walk you through deploying your WODgachi smart contracts to XDC Apothem testnet using Remix IDE - the easiest and most reliable method for WebContainer environments.

## 📋 Prerequisites

### Step 1: Get XDC Testnet Tokens
1. **Visit the XDC Apothem Faucet**: https://faucet.apothem.network/
2. **Enter your wallet address** (the one you'll use for deployment)
3. **Request testnet XDC tokens** (you'll need at least 5-10 XDC for deployment)
4. **Wait for confirmation** (usually 1-2 minutes)
5. **Verify you received the tokens** in your wallet

### Step 2: Configure XDC Apothem Network in MetaMask
1. **Open MetaMask** and click the network dropdown (usually shows "Ethereum Mainnet")
2. **Click "Add Network"** or "Custom RPC"
3. **Enter the following details**:
   ```
   Network Name: XDC Apothem Testnet
   New RPC URL: https://rpc.apothem.network
   Chain ID: 51
   Currency Symbol: XDC
   Block Explorer URL: https://explorer.apothem.network
   ```
4. **Save the network** and switch to it
5. **Verify your testnet XDC balance** appears in MetaMask

## 🏗️ Contract Deployment Process

### Step 3: Open Remix IDE
1. **Navigate to**: https://remix.ethereum.org/
2. **Wait for Remix to load** completely
3. **Create a new workspace** (optional but recommended):
   - Click "Create" → "Blank"
   - Name it "WODgachi-XDC"

### Step 4: Upload Contract Files
You need to copy these 5 contract files from your project to Remix:

#### 4.1: Create the Interface File
1. **In Remix**, create folder: `contracts/interfaces/`
2. **Create file**: `IFitnessOracle.sol`
3. **Copy the content** from `contracts/interfaces/IFitnessOracle.sol` in your project

#### 4.2: Create the Main Contract Files
Create these files in the `contracts/` folder in Remix:

1. **WODgachiToken.sol** - Copy from your project
2. **WODgachiNFT.sol** - Copy from your project  
3. **FitnessOracle.sol** - Copy from your project
4. **WODgachiCore.sol** - Copy from your project
5. **WODgachiRewards.sol** - Copy from your project

### Step 5: Install OpenZeppelin Dependencies
1. **In Remix**, go to the "File Explorer" tab
2. **Right-click** in the contracts folder
3. **Select "Install Dependencies"** or use the package manager
4. **Install OpenZeppelin**: `@openzeppelin/contracts@4.9.0`
5. **Wait for installation** to complete

### Step 6: Compile Contracts
1. **Go to the "Solidity Compiler" tab** (📄 icon)
2. **Select compiler version**: `0.8.19`
3. **Enable optimization**: Check "Enable optimization" with 200 runs
4. **Click "Compile All"**
5. **Verify no errors** - all contracts should compile successfully

### Step 7: Connect MetaMask to Remix
1. **Go to the "Deploy & Run Transactions" tab** (🚀 icon)
2. **In "Environment" dropdown**, select "Injected Provider - MetaMask"
3. **MetaMask will prompt** for connection - click "Connect"
4. **Verify** you see your account address and XDC balance
5. **Ensure** you're on XDC Apothem Testnet (Chain ID: 51)

## 🎯 Contract Deployment Sequence

**CRITICAL**: Deploy contracts in this exact order due to dependencies!

### Step 8: Deploy WODgachiToken (CRUSH Token)
1. **Select contract**: `WODgachiToken.sol`
2. **Click "Deploy"**
3. **Confirm transaction** in MetaMask
4. **Wait for confirmation** (usually 5-10 seconds)
5. **Copy the contract address** - you'll need this for other contracts
6. **Save address as**: `CRUSH_TOKEN_ADDRESS`

### Step 9: Deploy WODgachiNFT (Progress NFTs)
1. **Select contract**: `WODgachiNFT.sol`
2. **Click "Deploy"**
3. **Confirm transaction** in MetaMask
4. **Wait for confirmation**
5. **Copy the contract address**
6. **Save address as**: `PROGRESS_NFT_ADDRESS`

### Step 10: Deploy FitnessOracle
1. **Select contract**: `FitnessOracle.sol`
2. **In constructor parameters**, enter: `CRUSH_TOKEN_ADDRESS` (from Step 8)
3. **Click "Deploy"**
4. **Confirm transaction** in MetaMask
5. **Wait for confirmation**
6. **Copy the contract address**
7. **Save address as**: `FITNESS_ORACLE_ADDRESS`

### Step 11: Deploy WODgachiCore (Main Contract)
1. **Select contract**: `WODgachiCore.sol`
2. **In constructor parameters**, enter (in order):
   - `_crushToken`: `CRUSH_TOKEN_ADDRESS`
   - `_progressNFT`: `PROGRESS_NFT_ADDRESS`
   - `_fitnessOracle`: `FITNESS_ORACLE_ADDRESS`
3. **Click "Deploy"**
4. **Confirm transaction** in MetaMask
5. **Wait for confirmation**
6. **Copy the contract address**
7. **Save address as**: `CORE_CONTRACT_ADDRESS`

### Step 12: Deploy WODgachiRewards
1. **Select contract**: `WODgachiRewards.sol`
2. **In constructor parameters**, enter (in order):
   - `_crushToken`: `CRUSH_TOKEN_ADDRESS`
   - `_progressNFT`: `PROGRESS_NFT_ADDRESS`
3. **Click "Deploy"**
4. **Confirm transaction** in MetaMask
5. **Wait for confirmation**
6. **Copy the contract address**
7. **Save address as**: `REWARDS_CONTRACT_ADDRESS`

## ⚙️ Post-Deployment Configuration

### Step 13: Setup Contract Permissions

#### 13.1: Authorize Core Contract to Mint CRUSH Tokens
1. **In deployed contracts section**, find your `WODgachiToken` contract
2. **Expand it** and find the `authorizeMinter` function
3. **Enter parameter**: `CORE_CONTRACT_ADDRESS`
4. **Click "transact"** and confirm in MetaMask

#### 13.2: Authorize Core Contract to Mint NFTs
1. **Find your** `WODgachiNFT` contract
2. **Call** `authorizeMinter` function
3. **Enter parameter**: `CORE_CONTRACT_ADDRESS`
4. **Click "transact"** and confirm in MetaMask

#### 13.3: Setup Oracle Permissions
1. **Find your** `FitnessOracle` contract
2. **Call** `addOracleNode` function
3. **Enter parameter**: Your wallet address (the deployer address)
4. **Click "transact"** and confirm in MetaMask
5. **Call** `authorizeCaller` function
6. **Enter parameter**: `CORE_CONTRACT_ADDRESS`
7. **Click "transact"** and confirm in MetaMask

### Step 14: Add Valid Workout IDs
1. **Find your** `WODgachiCore` contract
2. **Call** `addValidWorkout` function for each workout:
   - `"hiit-cardio-blast"`
   - `"strength-upper-body"`
   - `"core-crusher"`
   - `"leg-day-beast"`
3. **For each workout ID**:
   - Enter the workout ID in quotes
   - Click "transact"
   - Confirm in MetaMask
   - Wait for confirmation

## 🧪 Testing Your Deployment

### Step 15: Test Contract Functions

#### 15.1: Register a Test User
1. **In WODgachiCore contract**, find `registerUser` function
2. **Enter parameters**:
   - `name`: `"TestUser"`
   - `creatureName`: `"TestHammy"`
3. **Click "transact"** and confirm in MetaMask

#### 15.2: Submit a Test Workout
1. **Call** `submitWorkout` function
2. **Enter parameters**:
   - `workoutId`: `"hiit-cardio-blast"`
   - `duration`: `30`
   - `difficulty`: `2`
3. **Click "transact"** and confirm in MetaMask

#### 15.3: Check CRUSH Token Balance
1. **In WODgachiToken contract**, find `balanceOf` function
2. **Enter your wallet address**
3. **Click "call"** (this is a read function, no gas needed)
4. **Verify you received CRUSH tokens** (should be 150 * 10^18)

## 📝 Update Your Frontend

### Step 16: Create Environment Variables File
Create a `.env` file in your project root with your deployed addresses:

```env
# XDC Apothem Testnet Contract Addresses
VITE_CRUSH_TOKEN_ADDRESS=0x... # Your WODgachiToken address
VITE_PROGRESS_NFT_ADDRESS=0x... # Your WODgachiNFT address  
VITE_FITNESS_ORACLE_ADDRESS=0x... # Your FitnessOracle address
VITE_CORE_CONTRACT_ADDRESS=0x... # Your WODgachiCore address
VITE_REWARDS_CONTRACT_ADDRESS=0x... # Your WODgachiRewards address

# XDC Network Configuration
VITE_XDC_TESTNET_RPC=https://rpc.apothem.network
VITE_XDC_TESTNET_CHAIN_ID=51
VITE_XDC_MAINNET_RPC=https://rpc.xinfin.network
VITE_XDC_MAINNET_CHAIN_ID=50
```

### Step 17: Test Frontend Integration
1. **Start your development server**: `npm run dev`
2. **Connect your wallet** using the wallet connection button
3. **Switch to XDC Apothem testnet** in MetaMask
4. **Test the Web3 features**:
   - Wallet connection should work
   - Progress sync should show your on-chain data
   - NFT minting should be available after 30 workouts

## 🔍 Verification and Monitoring

### Step 18: Verify on XDC Explorer
1. **Visit**: https://explorer.apothem.network/
2. **Search for each contract address**
3. **Verify transactions** appear correctly
4. **Check contract interactions** are working

### Step 19: Monitor Contract Activity
- **Token transfers**: Check CRUSH token movements
- **NFT mints**: Verify NFTs are minted at 30-workout milestones
- **Workout submissions**: Monitor workout data on-chain
- **Reward redemptions**: Test both CRUSH and NFT redemptions

## 🎉 Deployment Complete!

### Your WODgachi Contracts are Now Live on XDC Testnet! 

**Contract Addresses** (save these):
- **CRUSH Token**: `VITE_CRUSH_TOKEN_ADDRESS`
- **Progress NFT**: `VITE_PROGRESS_NFT_ADDRESS`
- **Fitness Oracle**: `VITE_FITNESS_ORACLE_ADDRESS`
- **Core Contract**: `VITE_CORE_CONTRACT_ADDRESS`
- **Rewards Contract**: `VITE_REWARDS_CONTRACT_ADDRESS`

### 🌟 Key Features Now Available:
✅ **CRUSH Token Rewards** - Earn 150 CRUSH per workout
✅ **Progress NFTs** - Mint milestone NFTs every 30 workouts
✅ **Dual Payment System** - Pay with CRUSH tokens OR XDC
✅ **Oracle Verification** - Enhanced workout verification
✅ **Leaderboard** - On-chain ranking system
✅ **Exclusive NFT Rewards** - Premium rewards only via NFT redemption

### 🔄 Next Steps:
1. **Test all features** thoroughly on testnet
2. **Gather user feedback** and iterate
3. **When ready for production**, deploy to XDC mainnet using the same process
4. **Set up oracle nodes** for real fitness data verification
5. **Launch your GameFi fitness revolution!** 🚀

### 🆘 Troubleshooting:
- **Gas estimation failed**: Increase gas limit in MetaMask
- **Transaction reverted**: Check constructor parameters are correct
- **Contract not found**: Verify you're on the correct network (Chain ID: 51)
- **Permission denied**: Ensure you completed all authorization steps

### 💡 Pro Tips:
- **Save all contract addresses** immediately after deployment
- **Test each function** before moving to the next contract
- **Keep your private key secure** - never share it
- **Use testnet first** before mainnet deployment
- **Monitor gas usage** - XDC is very cost-effective!

**Congratulations! Your WODgachi fitness ecosystem is now running on XDC Network!** 🎊

Ready to revolutionize fitness tracking with blockchain technology! 💪⛓️