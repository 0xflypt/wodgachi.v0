// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./WODgachiToken.sol";
import "./WODgachiNFT.sol";
import "./interfaces/IFitnessOracle.sol";

/**
 * @title WODgachiCore
 * @dev Main contract managing fitness tracking, rewards, and leaderboard
 */
contract WODgachiCore is Ownable, Pausable, ReentrancyGuard {
    WODgachiToken public crushToken;
    WODgachiNFT public progressNFT;
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
    event WorkoutSubmitted(address indexed user, string workoutId, uint256 points, bool verified);
    event WorkoutVerified(address indexed user, string workoutId, uint256 bonusPoints);
    event LevelUp(address indexed user, uint256 newLevel);
    event CreatureEvolved(address indexed user, uint256 newLevel);
    
    constructor(
        address _crushToken,
        address _progressNFT,
        address _fitnessOracle
    ) Ownable(msg.sender) {
        crushToken = WODgachiToken(_crushToken);
        progressNFT = WODgachiNFT(_progressNFT);
        fitnessOracle = IFitnessOracle(_fitnessOracle);
    }
    
    function registerUser(
        string memory name,
        string memory creatureName
    ) external whenNotPaused {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(creatureName).length > 0, "Creature name cannot be empty");
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
    ) external whenNotPaused nonReentrant {
        require(userProfiles[msg.sender].isActive, "User not registered");
        require(validWorkoutIds[workoutId], "Invalid workout ID");
        require(difficulty >= 1 && difficulty <= 3, "Invalid difficulty");
        require(duration >= 5 && duration <= 120, "Invalid duration");
        
        UserProfile storage user = userProfiles[msg.sender];
        
        // Calculate base points
        uint256 basePoints = 100 + (difficulty * 50) + (duration / 2);
        
        // Request oracle verification for additional rewards
        bool verified = fitnessOracle.verifyWorkout(msg.sender, workoutId, duration, difficulty);
        
        // Store workout
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
        
        // Update creature stats
        user.creatureHappiness = _min(100, user.creatureHappiness + 5);
        user.creatureEnergy = _min(100, user.creatureEnergy + 10);
        
        // Check for level up
        uint256 newLevel = (user.totalWorkouts / WORKOUTS_PER_LEVEL) + 1;
        if (newLevel > user.level) {
            user.level = newLevel;
            user.creatureLevel = newLevel;
            emit LevelUp(msg.sender, newLevel);
            emit CreatureEvolved(msg.sender, newLevel);
        }
        
        // Reward CRUSH tokens
        crushToken.rewardWorkout(msg.sender);
        
        emit WorkoutSubmitted(msg.sender, workoutId, basePoints, verified);
        
        // Check if eligible for NFT minting
        if (user.totalWorkouts % NFT_MILESTONE == 0) {
            _mintProgressNFT(msg.sender);
        }
    }
    
    function _mintProgressNFT(address user) internal {
        UserProfile memory profile = userProfiles[user];
        
        string memory metadataURI = string(abi.encodePacked(
            "https://api.wodgachi.com/metadata/",
            _toString(profile.totalWorkouts),
            "/",
            _toString(profile.level)
        ));
        
        progressNFT.mintProgressNFT(
            user,
            profile.totalWorkouts,
            profile.level,
            profile.streak,
            crushToken.balanceOf(user),
            profile.creatureName,
            profile.creatureLevel,
            metadataURI
        );
    }
    
    function getLeaderboard(uint256 limit) external view returns (
        address[] memory users,
        uint256[] memory points,
        uint256[] memory levels,
        uint256[] memory workouts
    ) {
        require(limit > 0 && limit <= 100, "Invalid limit");
        
        uint256 userCount = activeUsers.length;
        if (userCount == 0) {
            return (new address[](0), new uint256[](0), new uint256[](0), new uint256[](0));
        }
        
        uint256 returnCount = userCount < limit ? userCount : limit;
        
        users = new address[](returnCount);
        points = new uint256[](returnCount);
        levels = new uint256[](returnCount);
        workouts = new uint256[](returnCount);
        
        // Simple sorting - in production, consider off-chain sorting for gas efficiency
        address[] memory sortedUsers = new address[](userCount);
        uint256[] memory sortedPoints = new uint256[](userCount);
        
        for (uint256 i = 0; i < userCount; i++) {
            sortedUsers[i] = activeUsers[i];
            sortedPoints[i] = userPoints[activeUsers[i]];
        }
        
        // Bubble sort (simple for small datasets)
        for (uint256 i = 0; i < userCount - 1; i++) {
            for (uint256 j = 0; j < userCount - i - 1; j++) {
                if (sortedPoints[j] < sortedPoints[j + 1]) {
                    // Swap points
                    uint256 tempPoints = sortedPoints[j];
                    sortedPoints[j] = sortedPoints[j + 1];
                    sortedPoints[j + 1] = tempPoints;
                    
                    // Swap users
                    address tempUser = sortedUsers[j];
                    sortedUsers[j] = sortedUsers[j + 1];
                    sortedUsers[j + 1] = tempUser;
                }
            }
        }
        
        for (uint256 i = 0; i < returnCount; i++) {
            users[i] = sortedUsers[i];
            points[i] = sortedPoints[i];
            levels[i] = userProfiles[sortedUsers[i]].level;
            workouts[i] = userProfiles[sortedUsers[i]].totalWorkouts;
        }
        
        return (users, points, levels, workouts);
    }
    
    function addValidWorkout(string memory workoutId) external onlyOwner {
        validWorkoutIds[workoutId] = true;
    }
    
    function removeValidWorkout(string memory workoutId) external onlyOwner {
        validWorkoutIds[workoutId] = false;
    }
    
    function updateFitnessOracle(address newOracle) external onlyOwner {
        fitnessOracle = IFitnessOracle(newOracle);
    }
    
    function getUserProfile(address user) external view returns (UserProfile memory) {
        return userProfiles[user];
    }
    
    function getUserWorkouts(address user) external view returns (Workout[] memory) {
        return userWorkouts[user];
    }
    
    function getActiveUsersCount() external view returns (uint256) {
        return activeUsers.length;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}