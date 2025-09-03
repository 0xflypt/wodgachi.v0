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
    event OracleNodeAdded(address indexed node);
    
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
        emit OracleNodeAdded(nodeAddress);
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