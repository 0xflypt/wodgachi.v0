# 🚀 Simplified XDC Testnet Deployment Guide

Since WebContainer doesn't support native binaries, we'll use a simplified approach to deploy your WODgachi contracts.

## 📋 Prerequisites

1. **Get XDC Testnet Tokens**:
   - Visit: https://faucet.apothem.network/
   - Enter your wallet address
   - Request testnet XDC tokens

2. **Setup Private Key**:
   ```bash
   echo "PRIVATE_KEY=your_private_key_without_0x" > .env
   ```

## 🎯 Alternative Deployment Methods

Since Hardhat has native binary dependencies that don't work in WebContainer, here are your options:

### Option 1: Use Remix IDE (Recommended)
1. Go to https://remix.ethereum.org/
2. Create a new workspace
3. Copy your contract files to Remix
4. Configure XDC Apothem network in MetaMask:
   - Network Name: XDC Apothem Testnet
   - RPC URL: https://rpc.apothem.network
   - Chain ID: 51
   - Currency Symbol: XDC
   - Block Explorer: https://explorer.apothem.network

5. Deploy contracts one by one in this order:
   - WODgachiToken.sol
   - WODgachiNFT.sol  
   - FitnessOracle.sol
   - WODgachiCore.sol (pass the above contract addresses)
   - WODgachiRewards.sol (pass token and NFT addresses)

### Option 2: Use Truffle (WebContainer Compatible)
```bash
npm install -g truffle
truffle init
# Copy contracts to contracts/ folder
truffle compile
truffle migrate --network apothem
```

### Option 3: Deploy Locally Then Push
1. Clone this project locally on your machine
2. Install dependencies: `npm install`
3. Run deployment: `npx hardhat run scripts/deploy-testnet.js --network apothem`
4. Copy the deployed contract addresses back to your WebContainer project

## 🔧 Manual Contract Setup (If Using Remix)

After deploying via Remix, you'll need to:

1. **Authorize Minters**:
   ```solidity
   // On CRUSH Token contract
   authorizeMinter(CORE_CONTRACT_ADDRESS)
   
   // On Progress NFT contract  
   authorizeMinter(CORE_CONTRACT_ADDRESS)
   ```

2. **Setup Oracle**:
   ```solidity
   // On Fitness Oracle contract
   addOracleNode(YOUR_ADDRESS)
   authorizeCaller(CORE_CONTRACT_ADDRESS)
   ```

3. **Add Valid Workouts**:
   ```solidity
   // On Core contract
   addValidWorkout("hiit-cardio-blast")
   addValidWorkout("strength-upper-body")
   addValidWorkout("core-crusher")
   addValidWorkout("leg-day-beast")
   ```

## 🧪 Testing Your Deployment

Once deployed, test the contracts:

1. **Register User**: Call `registerUser("TestUser", "Hammy")` on Core contract
2. **Submit Workout**: Call `submitWorkout("hiit-cardio-blast", 30, 2)` 
3. **Check CRUSH Balance**: Call `balanceOf(YOUR_ADDRESS)` on CRUSH token
4. **Test Rewards**: Use either CRUSH tokens or XDC on Rewards contract

## 🎯 Contract Addresses to Update

After deployment, update your frontend `.env` with:
```env
VITE_CRUSH_TOKEN_ADDRESS=0x...
VITE_PROGRESS_NFT_ADDRESS=0x...
VITE_FITNESS_ORACLE_ADDRESS=0x...
VITE_CORE_CONTRACT_ADDRESS=0x...
VITE_REWARDS_CONTRACT_ADDRESS=0x...
```

## 🌐 Frontend Integration

Your React app will automatically work with the deployed contracts once you update the environment variables. The dual payment system (CRUSH + XDC) makes testing much easier!

**Recommendation**: Use Remix IDE for the quickest deployment, then copy the addresses back to your project.