# WODgachi Smart Contracts for XDC Network

This repository contains the smart contracts for WODgachi, a gamified fitness tracking application built for the XDC Network.

## 🏗️ Contract Architecture

### Core Contracts

1. **WODgachiToken (CRUSH)** - ERC20 token for fitness rewards
2. **WODgachiNFT** - ERC721 NFTs for workout milestone achievements  
3. **WODgachiCore** - Main contract managing user profiles and workouts
4. **FitnessOracle** - Oracle for verifying real-world fitness data
5. **WODgachiRewards** - Reward redemption system

## 🚀 Deployment Instructions

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Add your private key to `.env`:
```
PRIVATE_KEY=your_private_key_here
```

### Testnet Deployment (XDC Apothem)

1. Get testnet XDC from faucet:
   - Visit: https://faucet.apothem.network/
   - Enter your wallet address
   - Request testnet XDC

2. Deploy to testnet:
```bash
npx hardhat run scripts/deploy-testnet.js --network apothem
```

3. Setup oracle nodes:
```bash
npx hardhat run scripts/setup-oracle.js --network apothem
```

### Mainnet Deployment (XDC Network)

⚠️ **WARNING: This deploys to mainnet with real XDC!**

1. Ensure you have sufficient XDC (minimum 10 XDC recommended)

2. Deploy to mainnet:
```bash
npx hardhat run scripts/deploy-mainnet.js --network xdc
```

## 🔧 Contract Features

### CRUSH Token (ERC20)
- **Symbol**: CRUSH
- **Decimals**: 18
- **Max Supply**: 1 billion tokens
- **Workout Reward**: 150 CRUSH per workout
- **Streak Bonus**: 50 CRUSH for 7+ day streaks

### Progress NFTs (ERC721)
- Minted every 30 workout milestones
- Contains metadata: workouts, level, streak, creature info
- Can be redeemed for exclusive rewards
- Permanently stored on XDC blockchain

### Fitness Oracle
- Verifies workout authenticity using external data
- Supports multiple oracle nodes for decentralization
- Integrates with fitness devices and apps
- Provides bonus rewards for verified workouts

### Reward System
- Dual redemption: CRUSH tokens OR NFTs
- NFT redemptions don't cost CRUSH tokens
- Exclusive rewards only available via NFT redemption
- Automatic milestone tracking

## 🎯 Vibeathon Integration Features

### XDC Network Integration ✅
- All contracts deployed on XDC mainnet and testnet
- Optimized for XDC's low gas fees
- Uses XDC's fast transaction times

### Smart Contracts ✅
- 5 interconnected smart contracts
- ERC20 token for rewards
- ERC721 NFTs for achievements
- Oracle integration for real-world data
- Comprehensive reward system

### Oracle Integration ✅
- Custom fitness oracle for workout verification
- Real-world fitness data integration
- Decentralized verification network
- Bonus rewards for verified workouts

### Additional Features ✅
- Gamified fitness tracking
- Creature companion system
- Leaderboard with on-chain rankings
- NFT-based exclusive rewards
- Streak tracking and bonuses

## 🔍 Contract Verification

After deployment, verify contracts on XDC Explorer:

```bash
# Testnet verification
npx hardhat verify --network apothem <CONTRACT_ADDRESS>

# Mainnet verification  
npx hardhat verify --network xdc <CONTRACT_ADDRESS>
```

## 🧪 Testing

Run contract tests:
```bash
npx hardhat test
```

Run with gas reporting:
```bash
REPORT_GAS=true npx hardhat test
```

## 🌐 Frontend Integration

After deployment, update your frontend `.env` file with the contract addresses:

```env
VITE_CRUSH_TOKEN_ADDRESS=0x...
VITE_PROGRESS_NFT_ADDRESS=0x...
VITE_FITNESS_ORACLE_ADDRESS=0x...
VITE_CORE_CONTRACT_ADDRESS=0x...
VITE_REWARDS_CONTRACT_ADDRESS=0x...
```

## 🔐 Security Features

- OpenZeppelin security standards
- Pausable contracts for emergency stops
- Reentrancy protection
- Access control with role-based permissions
- Input validation and bounds checking

## 📊 Gas Optimization

- Efficient data structures
- Batch operations where possible
- Optimized for XDC's low gas costs
- Event-driven architecture for off-chain indexing

## 🎮 Game Mechanics

- **Levels**: Gained every 10 workouts
- **Streaks**: Bonus rewards for consistent training
- **NFT Milestones**: Every 30 workouts
- **Creature Evolution**: Tied to user level progression
- **Leaderboard**: On-chain ranking system

## 🏆 Vibeathon Compliance

This project fully meets the Vibeathon judging criteria:

✅ **XDC Network Integration**: All contracts deployed on XDC mainnet
✅ **Smart Contracts**: Comprehensive DeFi + GameFi contract suite  
✅ **Oracle Integration**: Custom fitness oracle with real-world data
✅ **Mainnet Deployment**: Production-ready deployment scripts
✅ **Additional Innovation**: Gamified fitness with NFT rewards

Ready to revolutionize fitness tracking on XDC! 🚀