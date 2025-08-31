const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WODgachi Contracts", function () {
  let crushToken, progressNFT, fitnessOracle, coreContract, rewardsContract;
  let owner, user1, user2, oracleNode;

  beforeEach(async function () {
    [owner, user1, user2, oracleNode] = await ethers.getSigners();

    // Deploy CRUSH Token
    const WODgachiToken = await ethers.getContractFactory("WODgachiToken");
    crushToken = await WODgachiToken.deploy();
    await crushToken.deployed();

    // Deploy Progress NFT
    const WODgachiNFT = await ethers.getContractFactory("WODgachiNFT");
    progressNFT = await WODgachiNFT.deploy();
    await progressNFT.deployed();

    // Deploy Fitness Oracle
    const FitnessOracle = await ethers.getContractFactory("FitnessOracle");
    fitnessOracle = await FitnessOracle.deploy();
    await fitnessOracle.deployed();

    // Deploy Core Contract
    const WODgachiCore = await ethers.getContractFactory("WODgachiCore");
    coreContract = await WODgachiCore.deploy(
      crushToken.address,
      progressNFT.address,
      fitnessOracle.address
    );
    await coreContract.deployed();

    // Deploy Rewards Contract
    const WODgachiRewards = await ethers.getContractFactory("WODgachiRewards");
    rewardsContract = await WODgachiRewards.deploy(
      crushToken.address,
      progressNFT.address
    );
    await rewardsContract.deployed();

    // Setup permissions
    await crushToken.authorizeMinter(coreContract.address);
    await progressNFT.authorizeMinter(coreContract.address);
    await fitnessOracle.addOracleNode(oracleNode.address);
    await fitnessOracle.authorizeCaller(coreContract.address);
    
    // Add valid workout
    await coreContract.addValidWorkout("test-workout");
  });

  describe("CRUSH Token", function () {
    it("Should have correct initial supply", async function () {
      const totalSupply = await crushToken.totalSupply();
      expect(totalSupply).to.equal(ethers.utils.parseEther("10000000"));
    });

    it("Should reward workout completion", async function () {
      await crushToken.rewardWorkout(user1.address);
      const balance = await crushToken.balanceOf(user1.address);
      expect(balance).to.equal(ethers.utils.parseEther("150"));
    });

    it("Should track user streaks", async function () {
      await crushToken.rewardWorkout(user1.address);
      const streak = await crushToken.getUserStreak(user1.address);
      expect(streak).to.equal(1);
    });
  });

  describe("Core Contract", function () {
    it("Should register new users", async function () {
      await coreContract.connect(user1).registerUser("TestUser", "Hammy");
      const profile = await coreContract.getUserProfile(user1.address);
      expect(profile.name).to.equal("TestUser");
      expect(profile.creatureName).to.equal("Hammy");
      expect(profile.isActive).to.be.true;
    });

    it("Should submit workouts and reward tokens", async function () {
      await coreContract.connect(user1).registerUser("TestUser", "Hammy");
      
      const initialBalance = await crushToken.balanceOf(user1.address);
      await coreContract.connect(user1).submitWorkout("test-workout", 30, 2);
      const finalBalance = await crushToken.balanceOf(user1.address);
      
      expect(finalBalance.gt(initialBalance)).to.be.true;
      
      const profile = await coreContract.getUserProfile(user1.address);
      expect(profile.totalWorkouts).to.equal(1);
    });

    it("Should level up users after 10 workouts", async function () {
      await coreContract.connect(user1).registerUser("TestUser", "Hammy");
      
      // Complete 10 workouts
      for (let i = 0; i < 10; i++) {
        await coreContract.connect(user1).submitWorkout("test-workout", 30, 2);
      }
      
      const profile = await coreContract.getUserProfile(user1.address);
      expect(profile.level).to.equal(2);
    });
  });

  describe("Progress NFT", function () {
    it("Should mint NFT at 30 workout milestone", async function () {
      await coreContract.connect(user1).registerUser("TestUser", "Hammy");
      
      // Complete 30 workouts to trigger NFT mint
      for (let i = 0; i < 30; i++) {
        await coreContract.connect(user1).submitWorkout("test-workout", 30, 2);
      }
      
      const userNFTs = await progressNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(1);
      
      const metadata = await progressNFT.getProgressMetadata(userNFTs[0]);
      expect(metadata.totalWorkouts).to.equal(30);
      expect(metadata.workoutsMilestone).to.equal(30);
    });

    it("Should prevent duplicate milestone minting", async function () {
      await coreContract.connect(user1).registerUser("TestUser", "Hammy");
      
      // Complete 35 workouts (should only mint one NFT for 30 milestone)
      for (let i = 0; i < 35; i++) {
        await coreContract.connect(user1).submitWorkout("test-workout", 30, 2);
      }
      
      const userNFTs = await progressNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(1);
    });
  });

  describe("Fitness Oracle", function () {
    it("Should submit and verify fitness data", async function () {
      await fitnessOracle.connect(oracleNode).submitFitnessData(
        user1.address,
        "test-workout",
        150, // heart rate
        300, // calories
        2500 // steps
      );
      
      const verified = await fitnessOracle.verifyWorkout(
        user1.address,
        "test-workout",
        30, // duration
        2   // difficulty
      );
      
      expect(verified).to.be.true;
    });

    it("Should reject invalid fitness data", async function () {
      await fitnessOracle.connect(oracleNode).submitFitnessData(
        user1.address,
        "test-workout",
        80,  // low heart rate
        50,  // low calories
        100  // low steps
      );
      
      const verified = await fitnessOracle.verifyWorkout(
        user1.address,
        "test-workout",
        30, // duration
        3   // high difficulty
      );
      
      expect(verified).to.be.false;
    });
  });

  describe("Rewards System", function () {
    beforeEach(async function () {
      await coreContract.connect(user1).registerUser("TestUser", "Hammy");
      
      // Give user some CRUSH tokens
      await crushToken.rewardWorkout(user1.address);
      await crushToken.rewardWorkout(user1.address);
      await crushToken.rewardWorkout(user1.address);
      await crushToken.rewardWorkout(user1.address); // 600 CRUSH total
    });

    it("Should redeem rewards with CRUSH tokens", async function () {
      const initialBalance = await crushToken.balanceOf(user1.address);
      
      // Approve rewards contract to spend CRUSH
      await crushToken.connect(user1).approve(rewardsContract.address, ethers.utils.parseEther("500"));
      
      await rewardsContract.connect(user1).redeemWithCRUSH("premium-workout");
      
      const finalBalance = await crushToken.balanceOf(user1.address);
      expect(initialBalance.sub(finalBalance)).to.equal(ethers.utils.parseEther("500"));
    });

    it("Should redeem rewards with NFTs", async function () {
      // Complete 30 workouts to get NFT
      for (let i = 0; i < 30; i++) {
        await coreContract.connect(user1).submitWorkout("test-workout", 30, 2);
      }
      
      const userNFTs = await progressNFT.getUserNFTs(user1.address);
      expect(userNFTs.length).to.equal(1);
      
      // Redeem reward with NFT (should not cost CRUSH)
      const initialBalance = await crushToken.balanceOf(user1.address);
      await rewardsContract.connect(user1).redeemWithNFT("premium-workout", userNFTs[0]);
      const finalBalance = await crushToken.balanceOf(user1.address);
      
      // Balance should remain the same (no CRUSH spent)
      expect(finalBalance).to.equal(initialBalance);
      
      // NFT should be marked as redeemed
      const metadata = await progressNFT.getProgressMetadata(userNFTs[0]);
      expect(metadata.isRedeemed).to.be.true;
    });
  });

  describe("Leaderboard", function () {
    it("Should return top users", async function () {
      // Register multiple users and complete workouts
      await coreContract.connect(user1).registerUser("User1", "Hammy1");
      await coreContract.connect(user2).registerUser("User2", "Hammy2");
      
      // User1 completes more workouts
      for (let i = 0; i < 5; i++) {
        await coreContract.connect(user1).submitWorkout("test-workout", 30, 2);
      }
      
      for (let i = 0; i < 3; i++) {
        await coreContract.connect(user2).submitWorkout("test-workout", 30, 2);
      }
      
      const [users, points, levels, workouts] = await coreContract.getLeaderboard(10);
      
      expect(users.length).to.be.greaterThan(0);
      expect(points.length).to.equal(users.length);
      expect(levels.length).to.equal(users.length);
      expect(workouts.length).to.equal(users.length);
    });
  });
});