// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IFitnessOracle.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

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
        
        // Check for level up
        uint256 newLevel = (user.totalWorkouts / WORKOUTS_PER_LEVEL) + 1;
        if (newLevel > user.level) {
            user.level = newLevel;
            user.creatureLevel = newLevel;
            emit LevelUp(msg.sender, newLevel);
        }
        
        // Reward CRUSH tokens
        crushToken.rewardWorkout(msg.sender);
        
        emit WorkoutSubmitted(msg.sender, workoutId, basePoints);
        
        // Check for NFT minting
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