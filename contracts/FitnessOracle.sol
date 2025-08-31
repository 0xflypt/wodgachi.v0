// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IFitnessOracle.sol";

/**
 * @title FitnessOracle
 * @dev Oracle contract for verifying fitness data and providing external fitness metrics
 */
contract FitnessOracle is IFitnessOracle, Ownable, Pausable {
    
    struct FitnessData {
        uint256 heartRate;
        uint256 caloriesBurned;
        uint256 steps;
        uint256 timestamp;
        bool verified;
    }
    
    struct OracleNode {
        address nodeAddress;
        bool isActive;
        uint256 reputation;
        uint256 totalVerifications;
    }
    
    mapping(address => mapping(string => FitnessData)) public userFitnessData;
    mapping(address => OracleNode) public oracleNodes;
    mapping(address => bool) public authorizedCallers;
    
    address[] public activeNodes;
    uint256 public constant MIN_NODES_FOR_CONSENSUS = 2;
    uint256 public constant VERIFICATION_REWARD = 10 * 10**18; // 10 CRUSH tokens
    
    event FitnessDataSubmitted(address indexed user, string workoutId, uint256 heartRate, uint256 calories);
    event WorkoutVerified(address indexed user, string workoutId, bool verified);
    event OracleNodeAdded(address indexed node);
    event OracleNodeRemoved(address indexed node);
    event CallerAuthorized(address indexed caller);
    
    modifier onlyAuthorizedCaller() {
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Not authorized caller");
        _;
    }
    
    modifier onlyActiveNode() {
        require(oracleNodes[msg.sender].isActive, "Not an active oracle node");
        _;
    }
    
    function authorizeCaller(address caller) external onlyOwner {
        authorizedCallers[caller] = true;
        emit CallerAuthorized(caller);
    }
    
    function addOracleNode(address nodeAddress) external onlyOwner {
        require(nodeAddress != address(0), "Invalid node address");
        require(!oracleNodes[nodeAddress].isActive, "Node already active");
        
        oracleNodes[nodeAddress] = OracleNode({
            nodeAddress: nodeAddress,
            isActive: true,
            reputation: 100,
            totalVerifications: 0
        });
        
        activeNodes.push(nodeAddress);
        emit OracleNodeAdded(nodeAddress);
    }
    
    function removeOracleNode(address nodeAddress) external onlyOwner {
        require(oracleNodes[nodeAddress].isActive, "Node not active");
        
        oracleNodes[nodeAddress].isActive = false;
        
        // Remove from active nodes array
        for (uint256 i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] == nodeAddress) {
                activeNodes[i] = activeNodes[activeNodes.length - 1];
                activeNodes.pop();
                break;
            }
        }
        
        emit OracleNodeRemoved(nodeAddress);
    }
    
    function submitFitnessData(
        address user,
        string memory workoutId,
        uint256 heartRate,
        uint256 caloriesBurned,
        uint256 steps
    ) external onlyActiveNode whenNotPaused {
        require(user != address(0), "Invalid user address");
        require(bytes(workoutId).length > 0, "Invalid workout ID");
        require(heartRate >= 60 && heartRate <= 220, "Invalid heart rate");
        require(caloriesBurned <= 2000, "Invalid calories burned");
        
        userFitnessData[user][workoutId] = FitnessData({
            heartRate: heartRate,
            caloriesBurned: caloriesBurned,
            steps: steps,
            timestamp: block.timestamp,
            verified: true
        });
        
        oracleNodes[msg.sender].totalVerifications++;
        
        emit FitnessDataSubmitted(user, workoutId, heartRate, caloriesBurned);
    }
    
    function verifyWorkout(
        address user,
        string memory workoutId,
        uint256 duration,
        uint256 difficulty
    ) external view override returns (bool) {
        FitnessData memory data = userFitnessData[user][workoutId];
        
        if (!data.verified || data.timestamp == 0) {
            return false;
        }
        
        // Verify workout intensity matches reported difficulty
        uint256 expectedMinHeartRate = 100 + (difficulty * 20);
        uint256 expectedMinCalories = duration * difficulty * 5;
        
        return data.heartRate >= expectedMinHeartRate && 
               data.caloriesBurned >= expectedMinCalories;
    }
    
    function getWorkoutVerificationStatus(
        address user,
        string memory workoutId
    ) external view returns (bool verified, uint256 heartRate, uint256 calories) {
        FitnessData memory data = userFitnessData[user][workoutId];
        return (data.verified, data.heartRate, data.caloriesBurned);
    }
    
    function requestFitnessVerification(
        string memory workoutId,
        uint256 expectedDuration,
        uint256 expectedDifficulty
    ) external whenNotPaused {
        // This function would trigger off-chain oracle nodes to verify fitness data
        // In production, this would emit an event that oracle nodes listen for
        emit WorkoutVerified(msg.sender, workoutId, true);
    }
    
    function getTopUsers(uint256 limit) external view returns (
        address[] memory users,
        string[] memory names,
        uint256[] memory points,
        uint256[] memory levels
    ) {
        require(limit > 0 && limit <= 50, "Invalid limit");
        
        uint256 userCount = activeNodes.length;
        uint256 returnCount = userCount < limit ? userCount : limit;
        
        users = new address[](returnCount);
        names = new string[](returnCount);
        points = new uint256[](returnCount);
        levels = new uint256[](returnCount);
        
        // Simple implementation - in production, use more efficient sorting
        for (uint256 i = 0; i < returnCount && i < activeUsers.length; i++) {
            address userAddr = activeUsers[i];
            users[i] = userAddr;
            names[i] = userProfiles[userAddr].name;
            points[i] = userPoints[userAddr];
            levels[i] = userProfiles[userAddr].level;
        }
        
        return (users, names, points, levels);
    }
    
    function updateContracts(address newToken, address newNFT) external onlyOwner {
        if (newToken != address(0)) {
            crushToken = WODgachiToken(newToken);
        }
        if (newNFT != address(0)) {
            progressNFT = WODgachiNFT(newNFT);
        }
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}