const hre = require("hardhat");
const { ethers } = hre;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("🌐 WODgachi XDC Mainnet Deployment Script");
  console.log("⚠️  WARNING: This will deploy to MAINNET with real XDC!");
  console.log("=====================================\n");
  
  const proceed = await askQuestion("Are you sure you want to deploy to XDC mainnet? (yes/no): ");
  if (proceed.toLowerCase() !== 'yes') {
    console.log("Deployment cancelled.");
    process.exit(0);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "XDC");
  
  if (balance.lt(ethers.utils.parseEther("20"))) {
    console.log("❌ Insufficient balance for mainnet deployment. Need at least 20 XDC.");
    const continueAnyway = await askQuestion("Continue anyway? (yes/no): ");
    if (continueAnyway.toLowerCase() !== 'yes') {
      process.exit(1);
    }
  }

  console.log("\n🚀 Starting deployment...\n");

  // Step 1: Deploy CRUSH Token
  console.log("📄 Step 1: Deploying WODgachi CRUSH Token...");
  const WODgachiToken = await ethers.getContractFactory("WODgachiToken");
  const crushToken = await WODgachiToken.deploy();
  await crushToken.deployed();
  console.log("✅ CRUSH Token deployed to:", crushToken.address);
  
  await askQuestion("Press Enter to continue to next step...");

  // Step 2: Deploy Progress NFT
  console.log("\n🎨 Step 2: Deploying WODgachi Progress NFT...");
  const WODgachiNFT = await ethers.getContractFactory("WODgachiNFT");
  const progressNFT = await WODgachiNFT.deploy();
  await progressNFT.deployed();
  console.log("✅ Progress NFT deployed to:", progressNFT.address);
  
  await askQuestion("Press Enter to continue to next step...");

  // Step 3: Deploy Fitness Oracle
  console.log("\n🔮 Step 3: Deploying Fitness Oracle...");
  const FitnessOracle = await ethers.getContractFactory("FitnessOracle");
  const fitnessOracle = await FitnessOracle.deploy();
  await fitnessOracle.deployed();
  console.log("✅ Fitness Oracle deployed to:", fitnessOracle.address);
  
  await askQuestion("Press Enter to continue to next step...");

  // Step 4: Deploy Core Contract
  console.log("\n🏗️ Step 4: Deploying WODgachi Core...");
  const WODgachiCore = await ethers.getContractFactory("WODgachiCore");
  const coreContract = await WODgachiCore.deploy(
    crushToken.address,
    progressNFT.address,
    fitnessOracle.address
  );
  await coreContract.deployed();
  console.log("✅ Core Contract deployed to:", coreContract.address);
  
  await askQuestion("Press Enter to continue to next step...");

  // Step 5: Deploy Rewards Contract
  console.log("\n🎁 Step 5: Deploying WODgachi Rewards...");
  const WODgachiRewards = await ethers.getContractFactory("WODgachiRewards");
  const rewardsContract = await WODgachiRewards.deploy(
    crushToken.address,
    progressNFT.address
  );
  await rewardsContract.deployed();
  console.log("✅ Rewards Contract deployed to:", rewardsContract.address);

  console.log("\n⚙️ Setting up contract permissions...");
  
  await askQuestion("Press Enter to start permission setup...");

  // Setup permissions
  console.log("Authorizing Core contract to mint CRUSH tokens...");
  await crushToken.authorizeMinter(coreContract.address);
  console.log("✅ Core contract authorized to mint CRUSH tokens");
  
  console.log("Authorizing Core contract to mint NFTs...");
  await progressNFT.authorizeMinter(coreContract.address);
  console.log("✅ Core contract authorized to mint NFTs");
  
  console.log("Adding deployer as oracle node...");
  await fitnessOracle.addOracleNode(deployer.address);
  console.log("✅ Deployer added as oracle node");
  
  console.log("Authorizing Core contract to call oracle...");
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
    console.log(`Adding workout: ${workoutId}...`);
    await coreContract.addValidWorkout(workoutId);
    console.log(`✅ Added valid workout: ${workoutId}`);
  }

  console.log("\n🎉 MAINNET DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log("\n📋 Contract Addresses (XDC Mainnet):");
  console.log("=====================================");
  console.log("CRUSH Token:", crushToken.address);
  console.log("Progress NFT:", progressNFT.address);
  console.log("Fitness Oracle:", fitnessOracle.address);
  console.log("Core Contract:", coreContract.address);
  console.log("Rewards Contract:", rewardsContract.address);
  
  console.log("\n🔗 Production Environment Variables:");
  console.log("====================================");
  console.log(`VITE_CRUSH_TOKEN_ADDRESS=${crushToken.address}`);
  console.log(`VITE_PROGRESS_NFT_ADDRESS=${progressNFT.address}`);
  console.log(`VITE_FITNESS_ORACLE_ADDRESS=${fitnessOracle.address}`);
  console.log(`VITE_CORE_CONTRACT_ADDRESS=${coreContract.address}`);
  console.log(`VITE_REWARDS_CONTRACT_ADDRESS=${rewardsContract.address}`);
  
  console.log("\n🔍 View on XDC Explorer:");
  console.log("========================");
  console.log(`https://explorer.xinfin.network/address/${crushToken.address}`);
  console.log(`https://explorer.xinfin.network/address/${progressNFT.address}`);
  console.log(`https://explorer.xinfin.network/address/${coreContract.address}`);
  
  console.log("\n🚀 Next Steps:");
  console.log("===============");
  console.log("1. Update your frontend .env file with the addresses above");
  console.log("2. Test all functions on mainnet with small amounts");
  console.log("3. Set up production oracle nodes");
  console.log("4. Configure monitoring and alerts");
  console.log("5. Announce your mainnet launch! 🎊");
  
  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Mainnet deployment failed:", error);
    rl.close();
    process.exit(1);
  });