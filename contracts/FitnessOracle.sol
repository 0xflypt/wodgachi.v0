// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IFitnessOracle.sol";

/**
 * @title FitnessOracle
 * @dev Oracle contract for verifying fitness data
 */
contract FitnessOracle is IFitnessOracle, Ownable, Pausable, ReentrancyGuard {
    
    struct FitnessData {
        uint256 heartRate;
        uint256 caloriesBurned;
        uint256 steps;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(address => mapping(string => FitnessData)) public userFitnessData;
    mapping(address => bool) public oracleNodes;
    mapping(address => bool) public authorizedCallers;
    
    address[] public activeNodes;
    
    event FitnessDataSubmitted(address indexed user, string workoutId, uint256 heartRate, uint256 calories, address indexed oracle);
    event WorkoutVerified(address indexed user, string workoutId, bool verified);
    event OracleNodeAdded(address indexed node);
    event OracleNodeRemoved(address indexed node);
    event CallerAuthorized(address indexed caller);
    
    modifier onlyAuthorizedCaller() {
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Not authorized caller");
        _;
    }
    
    modifier onlyActiveNode() {
        require(oracleNodes[msg.sender], "Not an active oracle node");
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    function authorizeCaller(address caller) external onlyOwner {
        authorizedCallers[caller] = true;
        emit CallerAuthorized(caller);
    }
    
    function addOracleNode(address nodeAddress) external onlyOwner {
        require(nodeAddress != address(0), "Invalid node address");
        require(!oracleNodes[nodeAddress], "Node already active");
        
        oracleNodes[nodeAddress] = true;
        activeNodes.push(nodeAddress);
        
        emit OracleNodeAdded(nodeAddress);
    }
    
    function removeOracleNode(address nodeAddress) external onlyOwner {
        require(oracleNodes[nodeAddress], "Node not active");
        
        oracleNodes[nodeAddress] = false;
        
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
        require(steps <= 50000, "Invalid step count");
        
        userFitnessData[user][workoutId] = FitnessData({
            heartRate: heartRate,
            caloriesBurned: caloriesBurned,
            steps: steps,
            timestamp: block.timestamp,
            verified: true
        });
        
        emit FitnessDataSubmitted(user, workoutId, heartRate, caloriesBurned, msg.sender);
        emit WorkoutVerified(user, workoutId, true);
    }
    
    function verifyWorkout(
        address user,
        string memory workoutId,
        uint256 duration,
        uint256 difficulty
    ) external view override returns (bool) {
        FitnessData storage data = userFitnessData[user][workoutId];
        
        if (!data.verified || data.timestamp == 0) {
            return false;
        }
        
        // Verify workout intensity matches reported difficulty
        uint256 expectedMinHeartRate = 100 + (difficulty * 20);
        uint256 expectedMinCalories = duration * difficulty * 5;
        uint256 expectedMinSteps = duration * 50;
        
        return data.heartRate >= expectedMinHeartRate && 
               data.caloriesBurned >= expectedMinCalories &&
               data.steps >= expectedMinSteps;
    }
    
    function getWorkoutVerificationStatus(
        address user,
        string memory workoutId
    ) external view override returns (bool verified, uint256 heartRate, uint256 calories) {
        FitnessData storage data = userFitnessData[user][workoutId];
        return (data.verified, data.heartRate, data.caloriesBurned);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}