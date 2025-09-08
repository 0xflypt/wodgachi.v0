# 🚀 Complete Dummy-Proof XDC Mainnet Deployment Guide

## 🎯 What You're About to Do

You're going to put your WODgachi fitness app on the **real blockchain** where people can use it with real money. This is like moving from a practice stage to the real world!

## ⚠️ CRITICAL WARNINGS FIRST

- **This costs real money** (~$50-100 in XDC tokens)
- **Mistakes can't be undone** - double-check everything
- **Test first** on testnet (practice blockchain)
- **Never share your private key** with anyone

---

## 📋 Pre-Deployment Checklist

### ✅ Things You Need Before Starting:
- [ ] A computer with internet
- [ ] Chrome or Firefox browser
- [ ] MetaMask wallet installed
- [ ] 50-100 XDC tokens (bought from exchange)
- [ ] Your private key written down safely
- [ ] 2-3 hours of uninterrupted time

---

## 🛒 Step 1: Get XDC Tokens (Real Money)

### 1.1: Buy XDC from Exchange
**Recommended exchanges:**
- **KuCoin** (easiest for beginners)
- **Bitfinex**
- **Gate.io**

**How much to buy:** 100 XDC tokens (~$50-100 depending on price)

### 1.2: Create Exchange Account
1. Go to KuCoin.com
2. Click "Sign Up"
3. Complete verification (upload ID)
4. Add payment method (credit card/bank)

### 1.3: Buy XDC
1. Search for "XDC" in KuCoin
2. Click "Buy XDC"
3. Enter amount: 100 XDC
4. Complete purchase
5. **Wait for purchase to complete** (can take 10-30 minutes)

---

## 🦊 Step 2: Setup MetaMask for XDC Network

### 2.1: Install MetaMask
1. Go to https://metamask.io/
2. Click "Download"
3. Install browser extension
4. Create new wallet (write down seed phrase!)

### 2.2: Add XDC Mainnet to MetaMask
1. **Open MetaMask**
2. **Click network dropdown** (shows "Ethereum Mainnet")
3. **Click "Add Network"**
4. **Click "Add a network manually"**
5. **Enter these details EXACTLY:**
   ```
   Network Name: XDC Network
   New RPC URL: https://rpc.xinfin.network
   Chain ID: 50
   Currency Symbol: XDC
   Block Explorer URL: https://explorer.xinfin.network
   ```
6. **Click "Save"**
7. **Switch to XDC Network**

### 2.3: Transfer XDC from Exchange to MetaMask
1. **In MetaMask:** Copy your wallet address (starts with 0x...)
2. **In KuCoin:** Go to "Assets" → "Withdraw"
3. **Select XDC**
4. **Paste your MetaMask address**
5. **Amount:** 90 XDC (leave 10 on exchange as backup)
6. **Network:** Select "XDC Network" (NOT Ethereum!)
7. **Click "Withdraw"**
8. **Wait 10-30 minutes** for transfer to complete
9. **Check MetaMask** - you should see your XDC balance

---

## 💻 Step 3: Prepare Contracts for Deployment

### 3.1: Open Remix IDE
1. Go to https://remix.ethereum.org/
2. Wait for it to load completely
3. You should see a file explorer on the left

### 3.2: Create Contract Files
**Create these 5 files in Remix (copy-paste exactly):**

1. **Create folder:** Right-click → "New Folder" → Name it "contracts"
2. **Create folder:** Right-click on contracts → "New Folder" → Name it "interfaces"

**File 1: contracts/interfaces/IFitnessOracle.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFitnessOracle {
    function verifyWorkout(
        address user,
        string memory workoutId,
        uint256 duration,
        uint256 difficulty
    ) external view returns (bool);
}
```

**File 2: contracts/WODgachiToken.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WODgachiToken {
    string public name = "WODgachi CRUSH Token";
    string public symbol = "CRUSH";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public authorizedMinters;
    
    address public owner;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        totalSupply = 10000000 * 10**18;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        
        emit Transfer(from, to, value);
        return true;
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    function rewardWorkout(address user) external onlyMinter {
        uint256 reward = 150 * 10**18;
        totalSupply += reward;
        balanceOf[user] += reward;
        emit Transfer(address(0), user, reward);
    }
}
```

**File 3: contracts/WODgachiNFT.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WODgachiNFT {
    string public name = "WODgachi Progress NFT";
    string public symbol = "WODPROG";
    
    uint256 private _tokenIdCounter = 1;
    address public owner;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(address => bool) public authorizedMinters;
    
    struct ProgressMetadata {
        uint256 totalWorkouts;
        uint256 level;
        uint256 streak;
        uint256 tokensEarned;
        string creatureName;
        uint256 creatureLevel;
        uint256 mintedAt;
        uint256 workoutsMilestone;
        bool isRedeemed;
        string redeemedFor;
    }
    
    mapping(uint256 => ProgressMetadata) public progressMetadata;
    mapping(address => uint256[]) public userNFTs;
    mapping(address => mapping(uint256 => bool)) public hasMintedMilestone;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    function mintProgressNFT(
        address to,
        uint256 totalWorkouts,
        uint256 level,
        uint256 streak,
        uint256 tokensEarned,
        string memory creatureName,
        uint256 creatureLevel,
        string memory metadataURI
    ) external onlyMinter returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(totalWorkouts >= 30, "Minimum 30 workouts required");
        
        uint256 workoutsMilestone = (totalWorkouts / 30) * 30;
        require(!hasMintedMilestone[to][workoutsMilestone], "Milestone already minted");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        
        progressMetadata[tokenId] = ProgressMetadata({
            totalWorkouts: totalWorkouts,
            level: level,
            streak: streak,
            tokensEarned: tokensEarned,
            creatureName: creatureName,
            creatureLevel: creatureLevel,
            mintedAt: block.timestamp,
            workoutsMilestone: workoutsMilestone,
            isRedeemed: false,
            redeemedFor: ""
        });
        
        userNFTs[to].push(tokenId);
        hasMintedMilestone[to][workoutsMilestone] = true;
        
        emit Transfer(address(0), to, tokenId);
        
        return tokenId;
    }
    
    function redeemNFT(uint256 tokenId, string memory rewardId) external {
        require(ownerOf[tokenId] == msg.sender, "Not owner");
        require(!progressMetadata[tokenId].isRedeemed, "Already redeemed");
        
        progressMetadata[tokenId].isRedeemed = true;
        progressMetadata[tokenId].redeemedFor = rewardId;
    }
    
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }
    
    function getProgressMetadata(uint256 tokenId) external view returns (ProgressMetadata memory) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return progressMetadata[tokenId];
    }
}
```

**File 4: contracts/FitnessOracle.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FitnessOracle {
    address public owner;
    
    struct FitnessData {
        uint256 heartRate;
        uint256 caloriesBurned;
        uint256 steps;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(address => bool) public oracleNodes;
    mapping(address => bool) public authorizedCallers;
    mapping(bytes32 => FitnessData) public fitnessData;
    
    event FitnessDataSubmitted(address indexed user, string workoutId, uint256 heartRate);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyOracle() {
        require(oracleNodes[msg.sender], "Not oracle");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        oracleNodes[msg.sender] = true;
    }
    
    function addOracleNode(address nodeAddress) external onlyOwner {
        oracleNodes[nodeAddress] = true;
    }
    
    function authorizeCaller(address caller) external onlyOwner {
        authorizedCallers[caller] = true;
    }
    
    function submitFitnessData(
        address user,
        string memory workoutId,
        uint256 heartRate,
        uint256 caloriesBurned,
        uint256 steps
    ) external onlyOracle {
        bytes32 key = keccak256(abi.encodePacked(user, workoutId));
        
        fitnessData[key] = FitnessData({
            heartRate: heartRate,
            caloriesBurned: caloriesBurned,
            steps: steps,
            timestamp: block.timestamp,
            verified: true
        });
        
        emit FitnessDataSubmitted(user, workoutId, heartRate);
    }
    
    function verifyWorkout(
        address user,
        string memory workoutId,
        uint256 duration,
        uint256 difficulty
    ) external view returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(user, workoutId));
        FitnessData memory data = fitnessData[key];
        
        if (!data.verified || data.timestamp == 0) {
            return false;
        }
        
        uint256 expectedMinHeartRate = 100 + (difficulty * 20);
        uint256 expectedMinCalories = duration * difficulty * 5;
        
        return data.heartRate >= expectedMinHeartRate && 
               data.caloriesBurned >= expectedMinCalories;
    }
}
```

**File 5: contracts/WODgachiCore.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IFitnessOracle.sol";

interface IWODgachiToken {
    function rewardWorkout(address user) external;
    function balanceOf(address account) external view returns (uint256);
}

interface IWODgachiNFT {
    function mintProgressNFT(
        address to,
        uint256 totalWorkouts,
        uint256 level,
        uint256 streak,
        uint256 tokensEarned,
        string memory creatureName,
        uint256 creatureLevel,
        string memory metadataURI
    ) external returns (uint256);
}

contract WODgachiCore {
    address public owner;
    IWODgachiToken public crushToken;
    IWODgachiNFT public progressNFT;
    IFitnessOracle public fitnessOracle;
    
    struct UserProfile {
        string name;
        uint256 level;
        uint256 totalWorkouts;
        uint256 streak;
        uint256 joinTimestamp;
        string creatureName;
        uint256 creatureLevel;
        uint256 creatureHappiness;
        uint256 creatureEnergy;
        bool isActive;
    }
    
    struct Workout {
        string workoutId;
        uint256 duration;
        uint256 difficulty;
        uint256 points;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(address => UserProfile) public userProfiles;
    mapping(address => Workout[]) public userWorkouts;
    mapping(address => uint256) public userPoints;
    mapping(string => bool) public validWorkoutIds;
    
    address[] public activeUsers;
    mapping(address => bool) public isActiveUser;
    
    uint256 public constant WORKOUTS_PER_LEVEL = 10;
    uint256 public constant NFT_MILESTONE = 30;
    
    event UserRegistered(address indexed user, string name, string creatureName);
    event WorkoutSubmitted(address indexed user, string workoutId, uint256 points);
    event LevelUp(address indexed user, uint256 newLevel);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(
        address _crushToken,
        address _progressNFT,
        address _fitnessOracle
    ) {
        owner = msg.sender;
        crushToken = IWODgachiToken(_crushToken);
        progressNFT = IWODgachiNFT(_progressNFT);
        fitnessOracle = IFitnessOracle(_fitnessOracle);
    }
    
    function registerUser(
        string memory name,
        string memory creatureName
    ) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!userProfiles[msg.sender].isActive, "User already registered");
        
        userProfiles[msg.sender] = UserProfile({
            name: name,
            level: 1,
            totalWorkouts: 0,
            streak: 0,
            joinTimestamp: block.timestamp,
            creatureName: creatureName,
            creatureLevel: 1,
            creatureHappiness: 100,
            creatureEnergy: 100,
            isActive: true
        });
        
        if (!isActiveUser[msg.sender]) {
            activeUsers.push(msg.sender);
            isActiveUser[msg.sender] = true;
        }
        
        emit UserRegistered(msg.sender, name, creatureName);
    }
    
    function submitWorkout(
        string memory workoutId,
        uint256 duration,
        uint256 difficulty
    ) external {
        require(userProfiles[msg.sender].isActive, "User not registered");
        require(validWorkoutIds[workoutId], "Invalid workout ID");
        require(difficulty >= 1 && difficulty <= 3, "Invalid difficulty");
        
        UserProfile storage user = userProfiles[msg.sender];
        
        uint256 basePoints = 100 + (difficulty * 50);
        bool verified = fitnessOracle.verifyWorkout(msg.sender, workoutId, duration, difficulty);
        
        userWorkouts[msg.sender].push(Workout({
            workoutId: workoutId,
            duration: duration,
            difficulty: difficulty,
            points: basePoints,
            timestamp: block.timestamp,
            verified: verified
        }));
        
        user.totalWorkouts++;
        userPoints[msg.sender] += basePoints;
        
        uint256 newLevel = (user.totalWorkouts / WORKOUTS_PER_LEVEL) + 1;
        if (newLevel > user.level) {
            user.level = newLevel;
            user.creatureLevel = newLevel;
            emit LevelUp(msg.sender, newLevel);
        }
        
        crushToken.rewardWorkout(msg.sender);
        
        emit WorkoutSubmitted(msg.sender, workoutId, basePoints);
        
        if (user.totalWorkouts % NFT_MILESTONE == 0) {
            progressNFT.mintProgressNFT(
                msg.sender,
                user.totalWorkouts,
                user.level,
                user.streak,
                crushToken.balanceOf(msg.sender),
                user.creatureName,
                user.creatureLevel,
                "https://api.wodgachi.com/metadata/"
            );
        }
    }
    
    function addValidWorkout(string memory workoutId) external onlyOwner {
        validWorkoutIds[workoutId] = true;
    }
    
    function getUserProfile(address user) external view returns (UserProfile memory) {
        return userProfiles[user];
    }
    
    function getLeaderboard(uint256 limit) external view returns (
        address[] memory users,
        uint256[] memory points,
        uint256[] memory levels,
        uint256[] memory workouts
    ) {
        uint256 userCount = activeUsers.length;
        if (userCount == 0) {
            return (new address[](0), new uint256[](0), new uint256[](0), new uint256[](0));
        }
        
        uint256 returnCount = userCount < limit ? userCount : limit;
        
        users = new address[](returnCount);
        points = new uint256[](returnCount);
        levels = new uint256[](returnCount);
        workouts = new uint256[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            users[i] = activeUsers[i];
            points[i] = userPoints[activeUsers[i]];
            levels[i] = userProfiles[activeUsers[i]].level;
            workouts[i] = userProfiles[activeUsers[i]].totalWorkouts;
        }
        
        return (users, points, levels, workouts);
    }
}
```

**File 6: contracts/WODgachiRewards.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20Simple {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface INFTSimple {
    function ownerOf(uint256 tokenId) external view returns (address);
    function redeemNFT(uint256 tokenId, string memory rewardId) external;
}

contract WODgachiRewards {
    address public owner;
    IERC20Simple public crushToken;
    INFTSimple public progressNFT;
    
    struct Reward {
        string id;
        uint256 crushCost;
        bool nftRedeemable;
        uint256 requiredMilestone;
        bool isActive;
    }
    
    mapping(string => Reward) public rewards;
    mapping(address => mapping(string => bool)) public userRedemptions;
    
    event RewardRedeemed(address indexed user, string rewardId, bool usedNFT);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _crushToken, address _progressNFT) {
        owner = msg.sender;
        crushToken = IERC20Simple(_crushToken);
        progressNFT = INFTSimple(_progressNFT);
        
        rewards["premium-workout"] = Reward("premium-workout", 500 * 10**18, true, 30, true);
        rewards["personal-trainer"] = Reward("personal-trainer", 1000 * 10**18, true, 60, true);
        rewards["nutrition-guide"] = Reward("nutrition-guide", 750 * 10**18, true, 90, true);
    }
    
    function redeemWithCRUSH(string memory rewardId) external {
        require(rewards[rewardId].isActive, "Reward not available");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        
        uint256 cost = rewards[rewardId].crushCost;
        require(crushToken.balanceOf(msg.sender) >= cost, "Insufficient CRUSH");
        require(crushToken.transferFrom(msg.sender, address(this), cost), "Transfer failed");
        
        userRedemptions[msg.sender][rewardId] = true;
        emit RewardRedeemed(msg.sender, rewardId, false);
    }
    
    function redeemWithNFT(string memory rewardId, uint256 nftTokenId) external {
        require(rewards[rewardId].isActive, "Reward not available");
        require(rewards[rewardId].nftRedeemable, "Not redeemable with NFT");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        require(progressNFT.ownerOf(nftTokenId) == msg.sender, "Not NFT owner");
        
        progressNFT.redeemNFT(nftTokenId, rewardId);
        userRedemptions[msg.sender][rewardId] = true;
        
        emit RewardRedeemed(msg.sender, rewardId, true);
    }
    
    function getRewardCostInXDC(string memory rewardId) external pure returns (uint256) {
        if (keccak256(abi.encodePacked(rewardId)) == keccak256(abi.encodePacked("premium-workout"))) {
            return 0.5 ether;
        } else if (keccak256(abi.encodePacked(rewardId)) == keccak256(abi.encodePacked("personal-trainer"))) {
            return 1.0 ether;
        } else if (keccak256(abi.encodePacked(rewardId)) == keccak256(abi.encodePacked("nutrition-guide"))) {
            return 0.75 ether;
        }
        return 0;
    }
    
    function redeemWithXDC(string memory rewardId) external payable {
        require(rewards[rewardId].isActive, "Reward not available");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        
        uint256 cost = this.getRewardCostInXDC(rewardId);
        require(msg.value >= cost, "Insufficient XDC");
        
        userRedemptions[msg.sender][rewardId] = true;
        
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
        
        emit RewardRedeemed(msg.sender, rewardId, false);
    }
    
    function withdrawXDC() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
```

### 3.3: Compile All Contracts
1. **Go to "Solidity Compiler" tab** (📄 icon on left)
2. **Select compiler version:** `0.8.19`
3. **Enable optimization:** Check the box, set to 200 runs
4. **Click "Compile All"**
5. **Check for errors** - should show green checkmarks for all files

**If you see errors, STOP and ask for help!**

---

## 🚀 Step 4: Deploy to XDC Mainnet

### 4.1: Connect MetaMask to Remix
1. **Go to "Deploy & Run Transactions" tab** (🚀 icon)
2. **Environment dropdown:** Select "Injected Provider - MetaMask"
3. **MetaMask popup:** Click "Connect"
4. **Verify:** You should see your wallet address and XDC balance

### 4.2: Deploy Contracts (EXACT ORDER!)

**⚠️ CRITICAL: Deploy in this exact order or it won't work!**

#### Deploy #1: WODgachiToken
1. **Select contract:** `WODgachiToken`
2. **Constructor:** Leave empty (no parameters needed)
3. **Click "Deploy"**
4. **MetaMask popup:** Click "Confirm" (costs ~3-4 XDC)
5. **Wait for confirmation** (30-60 seconds)
6. **Copy address** from deployed contracts section
7. **Save as:** `CRUSH_TOKEN_ADDRESS = 0x...`

#### Deploy #2: WODgachiNFT
1. **Select contract:** `WODgachiNFT`
2. **Constructor:** Leave empty
3. **Click "Deploy"**
4. **Confirm in MetaMask**
5. **Copy address**
6. **Save as:** `PROGRESS_NFT_ADDRESS = 0x...`

#### Deploy #3: FitnessOracle
1. **Select contract:** `FitnessOracle`
2. **Constructor:** Leave empty
3. **Click "Deploy"**
4. **Confirm in MetaMask**
5. **Copy address**
6. **Save as:** `FITNESS_ORACLE_ADDRESS = 0x...`

#### Deploy #4: WODgachiCore
1. **Select contract:** `WODgachiCore`
2. **Constructor parameters (VERY IMPORTANT):**
   - `_crushToken`: Paste your `CRUSH_TOKEN_ADDRESS`
   - `_progressNFT`: Paste your `PROGRESS_NFT_ADDRESS`
   - `_fitnessOracle`: Paste your `FITNESS_ORACLE_ADDRESS`
3. **Click "Deploy"**
4. **Confirm in MetaMask**
5. **Copy address**
6. **Save as:** `CORE_CONTRACT_ADDRESS = 0x...`

#### Deploy #5: WODgachiRewards
1. **Select contract:** `WODgachiRewards`
2. **Constructor parameters:**
   - `_crushToken`: Paste your `CRUSH_TOKEN_ADDRESS`
   - `_progressNFT`: Paste your `PROGRESS_NFT_ADDRESS`
3. **Click "Deploy"**
4. **Confirm in MetaMask**
5. **Copy address**
6. **Save as:** `REWARDS_CONTRACT_ADDRESS = 0x...`

---

## ⚙️ Step 5: Configure Contract Permissions

**⚠️ CRITICAL: If you skip this, your app won't work!**

### 5.1: Authorize Core Contract to Mint CRUSH Tokens
1. **Find your deployed WODgachiToken contract**
2. **Expand it** (click the arrow)
3. **Find `authorizeMinter` function**
4. **Enter parameter:** Your `CORE_CONTRACT_ADDRESS`
5. **Click "transact"**
6. **Confirm in MetaMask**

### 5.2: Authorize Core Contract to Mint NFTs
1. **Find your deployed WODgachiNFT contract**
2. **Find `authorizeMinter` function**
3. **Enter parameter:** Your `CORE_CONTRACT_ADDRESS`
4. **Click "transact"**
5. **Confirm in MetaMask**

### 5.3: Setup Oracle Permissions
1. **Find your deployed FitnessOracle contract**
2. **Call `addOracleNode` function**
3. **Enter parameter:** Your wallet address (the one you're deploying from)
4. **Click "transact"**
5. **Confirm in MetaMask**

6. **Call `authorizeCaller` function**
7. **Enter parameter:** Your `CORE_CONTRACT_ADDRESS`
8. **Click "transact"**
9. **Confirm in MetaMask**

### 5.4: Add Valid Workout IDs
1. **Find your deployed WODgachiCore contract**
2. **Call `addValidWorkout` function 4 times with these values:**
   - First call: `"hiit-cardio-blast"`
   - Second call: `"strength-upper-body"`
   - Third call: `"core-crusher"`
   - Fourth call: `"leg-day-beast"`
3. **For each call:** Click "transact" → Confirm in MetaMask

---

## 🧪 Step 6: Test Your Deployment

### 6.1: Register a Test User
1. **Find WODgachiCore contract**
2. **Call `registerUser` function**
3. **Parameters:**
   - `name`: `"TestUser"`
   - `creatureName`: `"TestHammy"`
4. **Click "transact"** → Confirm in MetaMask

### 6.2: Submit a Test Workout
1. **Call `submitWorkout` function**
2. **Parameters:**
   - `workoutId`: `"hiit-cardio-blast"`
   - `duration`: `30`
   - `difficulty`: `2`
3. **Click "transact"** → Confirm in MetaMask

### 6.3: Check CRUSH Token Balance
1. **Find WODgachiToken contract**
2. **Call `balanceOf` function**
3. **Parameter:** Your wallet address
4. **Click "call"** (this is free, no gas)
5. **You should see:** `150000000000000000000` (that's 150 CRUSH tokens!)

**If you see the balance, congratulations! Your deployment worked! 🎉**

---

## 📝 Step 7: Update Your Frontend

### 7.1: Create Production Environment File
Create a new `.env` file in your project with your deployed addresses:

```env
# XDC Mainnet Contract Addresses
VITE_CRUSH_TOKEN_ADDRESS=0x... # Your WODgachiToken address
VITE_PROGRESS_NFT_ADDRESS=0x... # Your WODgachiNFT address  
VITE_FITNESS_ORACLE_ADDRESS=0x... # Your FitnessOracle address
VITE_CORE_CONTRACT_ADDRESS=0x... # Your WODgachiCore address
VITE_REWARDS_CONTRACT_ADDRESS=0x... # Your WODgachiRewards address

# XDC Network Configuration
VITE_XDC_MAINNET_RPC=https://rpc.xinfin.network
VITE_XDC_MAINNET_CHAIN_ID=50
```

### 7.2: Test Frontend Integration
1. **Start your app:** `npm run dev`
2. **Connect wallet** in your app
3. **Switch MetaMask to XDC Network**
4. **Try the features:**
   - Register user
   - Complete workout
   - Check token balance
   - Mint NFT after 30 workouts

---

## 🔍 Step 8: Verify on XDC Explorer

### 8.1: Check Your Contracts
1. **Go to:** https://explorer.xinfin.network/
2. **Search for each contract address**
3. **Verify you can see:**
   - Contract creation transactions
   - Your test transactions
   - Token transfers

### 8.2: Monitor Activity
- **Token transfers:** Check CRUSH token movements
- **NFT mints:** Verify NFTs are created at 30-workout milestones
- **User registrations:** See new users joining
- **Workout submissions:** Monitor workout data

---

## 🎉 Congratulations! You're Live on XDC Mainnet!

### What You've Accomplished:
✅ **Deployed 5 smart contracts** to XDC mainnet
✅ **Created a real cryptocurrency** (CRUSH tokens)
✅ **Built an NFT system** for workout milestones
✅ **Launched a GameFi fitness app** on blockchain
✅ **Connected real money** to fitness achievements

### Your Users Can Now:
- **Earn real CRUSH tokens** for workouts
- **Mint NFTs** for their fitness achievements
- **Trade tokens** on decentralized exchanges
- **Redeem rewards** with tokens or NFTs
- **Compete globally** on blockchain leaderboards

---

## 🚨 Important Next Steps

### Security & Monitoring
1. **Monitor your contracts daily** on XDC Explorer
2. **Keep your private key secure** (consider hardware wallet)
3. **Set up alerts** for unusual activity
4. **Have an emergency plan** if something goes wrong

### Business Operations
1. **Set up customer support** for user questions
2. **Create documentation** for users
3. **Plan token economics** (how many tokens to mint, etc.)
4. **Consider legal compliance** in your jurisdiction

### Technical Improvements
1. **Set up proper oracle nodes** for fitness data verification
2. **Implement proper backend** for reward fulfillment
3. **Add more workout types** and features
4. **Scale infrastructure** as users grow

---

## 🆘 If Something Goes Wrong

### Common Issues:
- **"Transaction failed"** → Increase gas limit in MetaMask
- **"Insufficient funds"** → You need more XDC tokens
- **"Contract not found"** → Check you're on XDC Network (Chain ID: 50)
- **"Function not found"** → Contract didn't deploy properly, redeploy

### Emergency Contacts:
- **XDC Community:** https://t.me/xinfin
- **Technical Support:** Post in XDC developer forums
- **Your Team:** Have backup people who understand the system

---

## 💰 Cost Summary

**Total deployment cost:** ~20-30 XDC (~$50-100)
- Contract deployments: ~15-20 XDC
- Configuration transactions: ~5-10 XDC
- Testing transactions: ~2-5 XDC

**Ongoing costs:**
- User transactions: ~0.01-0.1 XDC each
- Oracle updates: ~0.05 XDC each
- Contract interactions: ~0.02-0.2 XDC each

---

## 🏆 You Did It!

You've successfully deployed a complete GameFi fitness ecosystem on XDC Network! Your app now runs on real blockchain infrastructure with real economic incentives. Users worldwide can earn cryptocurrency for staying fit!

**Welcome to the future of fitness! 🚀💪⛓️**