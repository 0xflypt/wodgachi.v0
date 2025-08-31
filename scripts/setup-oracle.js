const { ethers } = require("hardhat");

async function main() {
  console.log("🔮 Setting up Fitness Oracle nodes...");
  
  const [deployer] = await ethers.getSigners();
  
  // Get deployed contract addresses from environment or hardcode after deployment
  const ORACLE_ADDRESS = process.env.VITE_FITNESS_ORACLE_ADDRESS;
  
  if (!ORACLE_ADDRESS) {
    console.log("❌ Please set VITE_FITNESS_ORACLE_ADDRESS in your .env file");
    process.exit(1);
  }
  
  const FitnessOracle = await ethers.getContractFactory("FitnessOracle");
  const oracle = FitnessOracle.attach(ORACLE_ADDRESS);
  
  // Add additional oracle nodes for decentralization
  const oracleNodes = [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A", // Example oracle node 1
    "0x8ba1f109551bD432803012645Hac136c9c1495A", // Example oracle node 2
    "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3"  // Example oracle node 3
  ];
  
  console.log("\n📡 Adding oracle nodes...");
  for (const nodeAddress of oracleNodes) {
    try {
      await oracle.addOracleNode(nodeAddress);
      console.log(`✅ Added oracle node: ${nodeAddress}`);
    } catch (error) {
      console.log(`⚠️  Failed to add node ${nodeAddress}:`, error.message);
    }
  }
  
  // Submit sample fitness data for testing
  console.log("\n📊 Submitting sample fitness data...");
  try {
    await oracle.submitFitnessData(
      deployer.address,
      "hiit-cardio-blast",
      150, // heart rate
      300, // calories burned
      2500 // steps
    );
    console.log("✅ Sample fitness data submitted");
  } catch (error) {
    console.log("⚠️  Failed to submit sample data:", error.message);
  }
  
  console.log("\n🎉 Oracle setup completed!");
  console.log("\n📋 Oracle Configuration:");
  console.log("Oracle Address:", ORACLE_ADDRESS);
  console.log("Active Nodes:", oracleNodes.length + 1); // +1 for deployer
  console.log("\n🔗 Next Steps:");
  console.log("1. Set up off-chain oracle services to monitor fitness devices");
  console.log("2. Configure API endpoints for fitness data ingestion");
  console.log("3. Test workout verification with real fitness data");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Oracle setup failed:", error);
    process.exit(1);
  });