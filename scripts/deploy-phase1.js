const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("🚀 WODgachi Phase 1 Deployment (Mock Token Strategy)");
  console.log("====================================================\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "XDC");

  // Deploy Mock CRUSH Token (instead of real token)
  console.log("\n🎭 Step 1: Deploying Mock CRUSH Token...");
  const MockCRUSHToken = await ethers.getContractFactory("MockCRUSHToken");
  const mockCrushToken = await MockCRUSHToken.deploy();
  await mockCrushToken.deployed();
  console.log("✅ Mock CRUSH Token deployed to:", mockCrushToken.address);
  console.log("   ⚠️  This is a TEST token - no real value yet!");

  // Deploy Progress NFT (real NFTs with value)
  console.log("\n🎨 Step 2: Deploying WODgachi Progress NFT...");
  const WODgachiNFT = await ethers.getContractFactory("WODgachiNFT");
  const progressNFT = await WODgachiNFT.deploy();
  await progressNFT.deployed();
  console.log("✅ Progress NFT deployed to:", progressNFT.address);
  console.log("   ✨ These are REAL NFTs with actual value!");

  // Deploy Fitness Oracle
  console.log("\n🔮 Step 3: Deploying Fitness Oracle...");
  const FitnessOracle = await ethers.getContractFactory("FitnessOracle");
  const fitnessOracle = await FitnessOracle.deploy();
  await fitnessOracle.deployed();
  console.log("✅ Fitness Oracle deployed to:", fitnessOracle.address);

  // Deploy Enhanced Core Contract (with upgrade capability)
  console.log("\n🏗️ Step 4: Deploying WODgachi Core V2...");
  const WODgachiCoreV2 = await ethers.getContractFactory("WODgachiCoreV2");
  const coreContract = await WODgachiCoreV2.deploy(
    mockCrushToken.address,
    progressNFT.address,
    fitnessOracle.address
  );
  await coreContract.deployed();
  console.log("✅ Core Contract V2 deployed to:", coreContract.address);
  console.log("   🔄 Ready for token upgrade in Phase 2!");

  // Deploy Rewards Contract
  console.log("\n🎁 Step 5: Deploying WODgachi Rewards...");
  const WODgachiRewards = await ethers.getContractFactory("WODgachiRewards");
  const rewardsContract = await WODgachiRewards.deploy(
    mockCrushToken.address,
    progressNFT.address
  );
  await rewardsContract.deployed();
  console.log("✅ Rewards Contract deployed to:", rewardsContract.address);

  // Setup permissions
  console.log("\n⚙️ Setting up contract permissions...");
  
  await mockCrushToken.authorizeMinter(coreContract.address);
  console.log("✅ Core contract authorized to mint Mock CRUSH tokens");
  
  await progressNFT.authorizeMinter(coreContract.address);
  console.log("✅ Core contract authorized to mint NFTs");
  
  await fitnessOracle.addOracleNode(deployer.address);
  console.log("✅ Deployer added as oracle node");
  
  await fitnessOracle.authorizeCaller(coreContract.address);
  console.log("✅ Core contract authorized to call oracle");

  // Add valid workout IDs
  console.log("\n📋 Adding valid workout IDs...");
  const workoutIds = [
    "hiit-cardio-blast",
    "strength-upper-body", 
    "core-crusher",
    "leg-day-beast"
  ];
  
  for (const workoutId of workoutIds) {
    await coreContract.addValidWorkout(workoutId);
    console.log(`✅ Added valid workout: ${workoutId}`);
  }

  console.log("\n🎉 PHASE 1 DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log("\n📋 Contract Addresses (Phase 1):");
  console.log("=====================================");
  console.log("Mock CRUSH Token:", mockCrushToken.address);
  console.log("Progress NFT:", progressNFT.address);
  console.log("Fitness Oracle:", fitnessOracle.address);
  console.log("Core Contract V2:", coreContract.address);
  console.log("Rewards Contract:", rewardsContract.address);
  
  console.log("\n🔗 Environment Variables for Frontend:");
  console.log("====================================");
  console.log(`VITE_CRUSH_TOKEN_ADDRESS=${mockCrushToken.address}`);
  console.log(`VITE_PROGRESS_NFT_ADDRESS=${progressNFT.address}`);
  console.log(`VITE_FITNESS_ORACLE_ADDRESS=${fitnessOracle.address}`);
  console.log(`VITE_CORE_CONTRACT_ADDRESS=${coreContract.address}`);
  console.log(`VITE_REWARDS_CONTRACT_ADDRESS=${rewardsContract.address}`);
  
  console.log("\n🎯 Phase 1 Features Available:");
  console.log("==============================");
  console.log("✅ Full app functionality with mock tokens");
  console.log("✅ Real NFT minting for workout milestones");
  console.log("✅ Leaderboard and competition");
  console.log("✅ Workout tracking and verification");
  console.log("✅ Reward system (with mock tokens)");
  
  console.log("\n🚀 Next Steps:");
  console.log("===============");
  console.log("1. Update frontend with contract addresses");
  console.log("2. Launch app and build user base");
  console.log("3. Collect user feedback and data");
  console.log("4. Plan Phase 2 token launch in 3-6 months");
  console.log("5. Design real tokenomics based on usage data");
  
  console.log("\n💡 Phase 2 Preparation:");
  console.log("=======================");
  console.log("- Deploy real WODgachiToken contract");
  console.log("- Enable token upgrade in Core V2");
  console.log("- Migrate all user balances");
  console.log("- List real CRUSH on DEX");
  console.log("- Celebrate token launch! 🎊");
  
  console.log("\n⚠️  Important Notes:");
  console.log("===================");
  console.log("- Mock tokens have NO real value (yet!)");
  console.log("- NFTs are REAL and can be traded");
  console.log("- All user data will carry over to Phase 2");
  console.log("- Early users get bonus when real token launches");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Phase 1 deployment failed:", error);
    process.exit(1);
  });