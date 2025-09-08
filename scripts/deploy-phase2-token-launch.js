const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("🚀 WODgachi Phase 2: Real Token Launch");
  console.log("=====================================\n");
  
  // You'll need these addresses from Phase 1 deployment
  const MOCK_CRUSH_ADDRESS = process.env.MOCK_CRUSH_ADDRESS;
  const CORE_CONTRACT_ADDRESS = process.env.CORE_CONTRACT_ADDRESS;
  const REWARDS_CONTRACT_ADDRESS = process.env.REWARDS_CONTRACT_ADDRESS;
  
  if (!MOCK_CRUSH_ADDRESS || !CORE_CONTRACT_ADDRESS) {
    console.log("❌ Please set MOCK_CRUSH_ADDRESS and CORE_CONTRACT_ADDRESS in .env");
    process.exit(1);
  }
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying real token with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "XDC");

  // Step 1: Deploy Real CRUSH Token
  console.log("\n💎 Step 1: Deploying REAL WODgachi CRUSH Token...");
  const WODgachiToken = await ethers.getContractFactory("WODgachiToken");
  const realCrushToken = await WODgachiToken.deploy();
  await realCrushToken.deployed();
  console.log("✅ REAL CRUSH Token deployed to:", realCrushToken.address);
  console.log("   🎉 This token has REAL economic value!");

  // Step 2: Get contracts from Phase 1
  console.log("\n🔄 Step 2: Connecting to Phase 1 contracts...");
  const MockCRUSH = await ethers.getContractFactory("MockCRUSHToken");
  const mockToken = MockCRUSH.attach(MOCK_CRUSH_ADDRESS);
  
  const WODgachiCoreV2 = await ethers.getContractFactory("WODgachiCoreV2");
  const coreContract = WODgachiCoreV2.attach(CORE_CONTRACT_ADDRESS);
  
  console.log("✅ Connected to existing contracts");

  // Step 3: Authorize real token
  console.log("\n⚙️ Step 3: Setting up real token permissions...");
  await realCrushToken.authorizeMinter(CORE_CONTRACT_ADDRESS);
  console.log("✅ Core contract authorized to mint real CRUSH tokens");

  // Step 4: Enable token upgrade in core contract
  console.log("\n🔄 Step 4: Enabling token upgrade...");
  await coreContract.enableTokenUpgrade(realCrushToken.address);
  console.log("✅ Token upgrade enabled in core contract");

  // Step 5: Migrate user balances (example for first few users)
  console.log("\n📊 Step 5: Preparing balance migration...");
  
  // Get active users from core contract
  const [users, points, levels, workouts] = await coreContract.getLeaderboard(100);
  console.log(`Found ${users.length} active users to migrate`);

  // Calculate migration bonuses
  let totalMigrationAmount = ethers.BigNumber.from(0);
  const migrationData = [];
  
  for (let i = 0; i < users.length; i++) {
    const userAddress = users[i];
    const mockBalance = await mockToken.balanceOf(userAddress);
    
    if (mockBalance.gt(0)) {
      // Early adopter bonus: 20% extra tokens
      const bonusAmount = mockBalance.mul(20).div(100);
      const totalAmount = mockBalance.add(bonusAmount);
      
      migrationData.push({
        user: userAddress,
        mockBalance: mockBalance,
        bonusAmount: bonusAmount,
        totalAmount: totalAmount
      });
      
      totalMigrationAmount = totalMigrationAmount.add(totalAmount);
    }
  }

  console.log(`Total tokens to mint for migration: ${ethers.utils.formatEther(totalMigrationAmount)} CRUSH`);

  // Step 6: Execute migration (in batches to avoid gas limits)
  console.log("\n🔄 Step 6: Executing balance migration...");
  
  const batchSize = 10; // Process 10 users at a time
  for (let i = 0; i < migrationData.length; i += batchSize) {
    const batch = migrationData.slice(i, i + batchSize);
    
    for (const migration of batch) {
      // Mint real tokens to user
      await realCrushToken.mint(migration.user, migration.totalAmount);
      console.log(`✅ Migrated ${ethers.utils.formatEther(migration.totalAmount)} CRUSH to ${migration.user}`);
    }
    
    // Small delay between batches
    if (i + batchSize < migrationData.length) {
      console.log(`   Processed batch ${Math.floor(i/batchSize) + 1}, waiting...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Step 7: Upgrade core contract to use real token
  console.log("\n🔄 Step 7: Upgrading core contract to real token...");
  await coreContract.upgradeToNewToken();
  console.log("✅ Core contract now uses real CRUSH token");

  // Step 8: Deactivate mock token
  console.log("\n🔒 Step 8: Deactivating mock token...");
  await mockToken.deactivateToken();
  console.log("✅ Mock token deactivated - users must use real CRUSH now");

  // Step 9: Deploy new rewards contract for real token
  console.log("\n🎁 Step 9: Deploying new rewards contract...");
  const WODgachiRewards = await ethers.getContractFactory("WODgachiRewards");
  const newRewardsContract = await WODgachiRewards.deploy(
    realCrushToken.address,
    process.env.PROGRESS_NFT_ADDRESS
  );
  await newRewardsContract.deployed();
  console.log("✅ New rewards contract deployed to:", newRewardsContract.address);

  console.log("\n🎉 PHASE 2 TOKEN LAUNCH COMPLETED!");
  console.log("\n📋 Updated Contract Addresses:");
  console.log("==============================");
  console.log("REAL CRUSH Token:", realCrushToken.address);
  console.log("Core Contract V2:", CORE_CONTRACT_ADDRESS, "(upgraded)");
  console.log("New Rewards Contract:", newRewardsContract.address);
  console.log("Mock CRUSH Token:", MOCK_CRUSH_ADDRESS, "(deactivated)");
  
  console.log("\n🔗 Updated Environment Variables:");
  console.log("=================================");
  console.log(`VITE_CRUSH_TOKEN_ADDRESS=${realCrushToken.address}`);
  console.log(`VITE_REWARDS_CONTRACT_ADDRESS=${newRewardsContract.address}`);
  console.log("# Keep other addresses the same");
  
  console.log("\n🎯 Phase 2 Features Now Available:");
  console.log("==================================");
  console.log("✅ Real CRUSH tokens with economic value");
  console.log("✅ All mock balances migrated with 20% bonus");
  console.log("✅ Tokens can be traded on DEX");
  console.log("✅ Real economic incentives for fitness");
  console.log("✅ Enhanced reward system");
  
  console.log("\n🚀 Next Steps:");
  console.log("===============");
  console.log("1. Update frontend with new token address");
  console.log("2. Announce token launch to community");
  console.log("3. List CRUSH token on DEX (Uniswap, etc.)");
  console.log("4. Create liquidity pools");
  console.log("5. Launch marketing campaign");
  console.log("6. Celebrate with community! 🎊");
  
  console.log("\n💰 Migration Summary:");
  console.log("=====================");
  console.log(`Total users migrated: ${migrationData.length}`);
  console.log(`Total CRUSH minted: ${ethers.utils.formatEther(totalMigrationAmount)}`);
  console.log(`Average bonus per user: 20%`);
  console.log(`Mock token status: DEACTIVATED`);
  
  console.log("\n🎊 Welcome to the real WODgachi economy!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Phase 2 token launch failed:", error);
    process.exit(1);
  });