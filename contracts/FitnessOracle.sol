// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IFitnessOracle.sol";

/**
 * @title FitnessOracle
 * @dev Enhanced oracle contract for verifying fitness data with consensus mechanism
 */
contract FitnessOracle is IFitnessOracle, Ownable, Pausable, ReentrancyGuard {
    
    struct FitnessData {
        uint256 heartRate;
        uint256 caloriesBurned;
        uint256 steps;
        uint256 timestamp;
        bool verified;
        uint256 confirmations;
    }
    
    struct OracleNode {
        address nodeAddress;
        bool isActive;
        uint256 reputation;
        uint256 totalVerifications;
        uint256 successfulVerifications;
        uint256 lastRewardClaim;
    }
    
    struct WorkoutSubmission {
        address user;
        string workoutId;
        uint256 expectedHeartRate;
        uint256 expectedCalories;
        uint256 expectedSteps;
        uint256 timestamp;
        uint256 confirmations;
        bool finalized;
    }
    
    // Storage variables
    mapping(address => mapping(string => FitnessData)) public userFitnessData;
    mapping(address => OracleNode) public oracleNodes;
    mapping(address => bool) public authorizedCallers;
    mapping(bytes32 => WorkoutSubmission) public workoutSubmissions;
    mapping(bytes32 => mapping(address => bool)) public submissionConfirmedBy;
    mapping(address => uint256) public pendingRewards;
    
    address[] public activeNodes;
    bytes32[] public pendingSubmissions;
    
    // Configuration
    uint256 public constant MIN_NODES_FOR_CONSENSUS = 2;
    uint256 public constant VERIFICATION_REWARD = 10 * 10**18; // 10 CRUSH tokens
    uint256 public constant MIN_REPUTATION = 50;
    uint256 public constant REPUTATION_PENALTY = 10;
    uint256 public constant REPUTATION_REWARD = 5;
    uint256 public constant REWARD_CLAIM_COOLDOWN = 1 hours;
    
    // External contracts
    IERC20 public crushToken;
    
    event FitnessDataSubmitted(address indexed user, string workoutId, uint256 heartRate, uint256 calories, address indexed oracle);
    event WorkoutVerified(address indexed user, string workoutId, bool verified, uint256 confirmations);
    event OracleNodeAdded(address indexed node);
    event OracleNodeRemoved(address indexed node);
    event CallerAuthorized(address indexed caller);
    event ReputationUpdated(address indexed node, uint256 newReputation);
    event RewardClaimed(address indexed oracle, uint256 amount);
    event ConsensusReached(bytes32 indexed submissionId, bool verified);
    
    modifier onlyAuthorizedCaller() {
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Not authorized caller");
        _;
    }
    
    modifier onlyActiveNode() {
        require(oracleNodes[msg.sender].isActive, "Not an active oracle node");
        require(oracleNodes[msg.sender].reputation >= MIN_REPUTATION, "Insufficient reputation");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // crushToken will be set after deployment
    }
    
    function setCrushToken(address _crushToken) external onlyOwner {
        require(_crushToken != address(0), "Invalid token address");
        crushToken = IERC20(_crushToken);
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
            totalVerifications: 0,
            successfulVerifications: 0,
            lastRewardClaim: 0
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
    ) external onlyActiveNode whenNotPaused nonReentrant {
        require(user != address(0), "Invalid user address");
        require(bytes(workoutId).length > 0, "Invalid workout ID");
        require(heartRate >= 60 && heartRate <= 220, "Invalid heart rate");
        require(caloriesBurned <= 2000, "Invalid calories burned");
        require(steps <= 50000, "Invalid step count");
        
        bytes32 submissionId = keccak256(abi.encodePacked(user, workoutId, block.timestamp));
        
        // Check if this oracle already submitted for this workout
        require(!submissionConfirmedBy[submissionId][msg.sender], "Already submitted by this oracle");
        
        // Initialize submission if first oracle
        if (workoutSubmissions[submissionId].timestamp == 0) {
            workoutSubmissions[submissionId] = WorkoutSubmission({
                user: user,
                workoutId: workoutId,
                expectedHeartRate: heartRate,
                expectedCalories: caloriesBurned,
                expectedSteps: steps,
                timestamp: block.timestamp,
                confirmations: 0,
                finalized: false
            });
            pendingSubmissions.push(submissionId);
        }
        
        // Record submission
        submissionConfirmedBy[submissionId][msg.sender] = true;
        workoutSubmissions[submissionId].confirmations++;
        
        // Update oracle stats
        oracleNodes[msg.sender].totalVerifications++;
        
        emit FitnessDataSubmitted(user, workoutId, heartRate, caloriesBurned, msg.sender);
        
        // Check for consensus
        if (workoutSubmissions[submissionId].confirmations >= MIN_NODES_FOR_CONSENSUS) {
            _finalizeWorkoutVerification(submissionId);
        }
    }
    
    function _finalizeWorkoutVerification(bytes32 submissionId) internal {
        WorkoutSubmission storage submission = workoutSubmissions[submissionId];
        require(!submission.finalized, "Already finalized");
        
        submission.finalized = true;
        
        // Store verified fitness data
        userFitnessData[submission.user][submission.workoutId] = FitnessData({
            heartRate: submission.expectedHeartRate,
            caloriesBurned: submission.expectedCalories,
            steps: submission.expectedSteps,
            timestamp: submission.timestamp,
            verified: true,
            confirmations: submission.confirmations
        });
        
        // Distribute rewards to participating oracles
        _distributeOracleRewards(submissionId);
        
        emit WorkoutVerified(submission.user, submission.workoutId, true, submission.confirmations);
        emit ConsensusReached(submissionId, true);
        
        // Remove from pending submissions
        _removePendingSubmission(submissionId);
    }
    
    function _distributeOracleRewards(bytes32 submissionId) internal {
        // Reward each oracle that participated
        for (uint256 i = 0; i < activeNodes.length; i++) {
            address nodeAddress = activeNodes[i];
            if (submissionConfirmedBy[submissionId][nodeAddress]) {
                oracleNodes[nodeAddress].successfulVerifications++;
                oracleNodes[nodeAddress].reputation += REPUTATION_REWARD;
                pendingRewards[nodeAddress] += VERIFICATION_REWARD;
            }
        }
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
        
        // Enhanced verification logic with consensus requirement
        if (data.confirmations < MIN_NODES_FOR_CONSENSUS) {
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
    ) external view returns (bool verified, uint256 heartRate, uint256 calories) {
        FitnessData storage data = userFitnessData[user][workoutId];
        return (data.verified && data.confirmations >= MIN_NODES_FOR_CONSENSUS, data.heartRate, data.caloriesBurned);
    }
    
    function _removePendingSubmission(bytes32 submissionId) internal {
        for (uint256 i = 0; i < pendingSubmissions.length; i++) {
            if (pendingSubmissions[i] == submissionId) {
                pendingSubmissions[i] = pendingSubmissions[pendingSubmissions.length - 1];
                pendingSubmissions.pop();
                break;
            }
        }
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdrawXDC() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}