const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("🌐 Deploying WODgachi contracts to XDC Mainnet...");
  console.log("⚠️  WARNING: This will deploy to MAINNET with real XDC!");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "XDC");
  
  if (balance.lt(ethers.utils.parseEther("10"))) {
    console.log("❌ Insufficient balance for mainnet deployment. Need at least 10 XDC.");
    process.exit(1);
  }

  // Deploy CRUSH Token
  console.log("\n📄 Deploying WODgachi CRUSH Token...");
  const WODgachiToken = await ethers.getContractFactory("WODgachiToken");
  const crushToken = await WODgachiToken.deploy();
  await crushToken.deployed();
  console.log("✅ CRUSH Token deployed to:", crushToken.address);

  // Deploy Progress NFT
  console.log("\n🎨 Deploying WODgachi Progress NFT...");
  const WODgachiNFT = await ethers.getContractFactory("WODgachiNFT");
  const progressNFT = await WODgachiNFT.deploy();
  await progressNFT.deployed();
  console.log("✅ Progress NFT deployed to:", progressNFT.address);

  // Deploy Fitness Oracle
  console.log("\n🔮 Deploying Fitness Oracle...");
  const FitnessOracle = await ethers.getContractFactory("FitnessOracle");
  const fitnessOracle = await FitnessOracle.deploy();
  await fitnessOracle.deployed();
  console.log("✅ Fitness Oracle deployed to:", fitnessOracle.address);

  // Deploy Core Contract
  console.log("\n🏗️ Deploying WODgachi Core...");
  const WODgachiCore = await ethers.getContractFactory("WODgachiCore");
  const coreContract = await WODgachiCore.deploy(
    crushToken.address,
    progressNFT.address,
    fitnessOracle.address
  );
  await coreContract.deployed();
  console.log("✅ Core Contract deployed to:", coreContract.address);

  // Deploy Rewards Contract
  console.log("\n🎁 Deploying WODgachi Rewards...");
  const WODgachiRewards = await ethers.getContractFactory("WODgachiRewards");
  const rewardsContract = await WODgachiRewards.deploy(
    crushToken.address,
    progressNFT.address
  );
  await rewardsContract.deployed();
  console.log("✅ Rewards Contract deployed to:", rewardsContract.address);

  // Setup permissions
  console.log("\n⚙️ Setting up contract permissions...");
  
  await crushToken.authorizeMinter(coreContract.address);
  console.log("✅ Core contract authorized to mint CRUSH tokens");
  
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

  console.log("\n🎉 MAINNET deployment completed successfully!");
  console.log("\n📋 Contract Addresses (XDC Mainnet):");
  console.log("CRUSH Token:", crushToken.address);
  console.log("Progress NFT:", progressNFT.address);
  console.log("Fitness Oracle:", fitnessOracle.address);
  console.log("Core Contract:", coreContract.address);
  console.log("Rewards Contract:", rewardsContract.address);
  
  console.log("\n🔗 Production Environment Variables:");
  console.log(`VITE_CRUSH_TOKEN_ADDRESS=${crushToken.address}`);
  console.log(`VITE_PROGRESS_NFT_ADDRESS=${progressNFT.address}`);
  console.log(`VITE_FITNESS_ORACLE_ADDRESS=${fitnessOracle.address}`);
  console.log(`VITE_CORE_CONTRACT_ADDRESS=${coreContract.address}`);
  console.log(`VITE_REWARDS_CONTRACT_ADDRESS=${rewardsContract.address}`);
  
  console.log("\n🔍 View on XDC Explorer:");
  console.log(`https://explorer.xinfin.network/address/${crushToken.address}`);
  console.log(`https://explorer.xinfin.network/address/${progressNFT.address}`);
  console.log(`https://explorer.xinfin.network/address/${coreContract.address}`);
  
  console.log("\n📝 Contract verification commands:");
  console.log(`npx hardhat verify --network xdc ${crushToken.address}`);
  console.log(`npx hardhat verify --network xdc ${progressNFT.address}`);
  console.log(`npx hardhat verify --network xdc ${fitnessOracle.address}`);
  console.log(`npx hardhat verify --network xdc ${coreContract.address} ${crushToken.address} ${progressNFT.address} ${fitnessOracle.address}`);
  console.log(`npx hardhat verify --network xdc ${rewardsContract.address} ${crushToken.address} ${progressNFT.address}`);
  
  console.log("\n🚀 Ready for production! Remember to:");
  console.log("1. Update frontend environment variables");
  console.log("2. Test all functions on testnet first");
  console.log("3. Set up oracle nodes for fitness verification");
  console.log("4. Configure reward redemption backend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Mainnet deployment failed:", error);
    process.exit(1);
  });