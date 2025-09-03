// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
        mapping(address => bool) confirmedBy;
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
        mapping(address => bool) submittedBy;
    }
    
    // Storage variables
    mapping(address => mapping(string => FitnessData)) public userFitnessData;
    mapping(address => OracleNode) public oracleNodes;
    mapping(address => bool) public authorizedCallers;
    mapping(bytes32 => WorkoutSubmission) public workoutSubmissions;
    mapping(address => uint256) public pendingRewards;
    
    address[] public activeNodes;
    bytes32[] public pendingSubmissions;
    
    // Configuration
    uint256 public constant MIN_NODES_FOR_CONSENSUS = 3;
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
    
    constructor(address _crushToken) Ownable(msg.sender) {
        crushToken = IERC20(_crushToken);
    }
    
    function setCrushToken(address _crushToken) external onlyOwner {
        require(_crushToken != address(0), "Invalid token address");
        crushToken = _crushToken;
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
        
        // Cache oracle node to avoid multiple storage reads (gas optimization)
        OracleNode storage node = oracleNodes[msg.sender];
        
        bytes32 submissionId = keccak256(abi.encodePacked(user, workoutId, block.timestamp));
        
        // Check if this oracle already submitted for this workout
        require(!workoutSubmissions[submissionId].submittedBy[msg.sender], "Already submitted by this oracle");
        
        // Initialize submission if first oracle
        if (workoutSubmissions[submissionId].timestamp == 0) {
            workoutSubmissions[submissionId].user = user;
            workoutSubmissions[submissionId].workoutId = workoutId;
            workoutSubmissions[submissionId].expectedHeartRate = heartRate;
            workoutSubmissions[submissionId].expectedCalories = caloriesBurned;
            workoutSubmissions[submissionId].expectedSteps = steps;
            workoutSubmissions[submissionId].timestamp = block.timestamp;
            pendingSubmissions.push(submissionId);
        } else {
            // Validate submission matches previous submissions (within tolerance)
            WorkoutSubmission storage submission = workoutSubmissions[submissionId];
            require(_isWithinTolerance(heartRate, submission.expectedHeartRate, 10), "Heart rate mismatch");
            require(_isWithinTolerance(caloriesBurned, submission.expectedCalories, 20), "Calories mismatch");
            require(_isWithinTolerance(steps, submission.expectedSteps, 500), "Steps mismatch");
        }
        
        // Record submission
        workoutSubmissions[submissionId].submittedBy[msg.sender] = true;
        workoutSubmissions[submissionId].confirmations++;
        
        // Update oracle stats
        node.totalVerifications++;
        
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
        FitnessData storage data = userFitnessData[submission.user][submission.workoutId];
        data.heartRate = submission.expectedHeartRate;
        data.caloriesBurned = submission.expectedCalories;
        data.steps = submission.expectedSteps;
        data.timestamp = submission.timestamp;
        data.verified = true;
        data.confirmations = submission.confirmations;
        
        // Distribute rewards to participating oracles
        _distributeOracleRewards(submissionId);
        
        emit WorkoutVerified(submission.user, submission.workoutId, true, submission.confirmations);
        emit ConsensusReached(submissionId, true);
        
        // Remove from pending submissions
        _removePendingSubmission(submissionId);
    }
    
    function _distributeOracleRewards(bytes32 submissionId) internal {
        WorkoutSubmission storage submission = workoutSubmissions[submissionId];
        
        // Reward each oracle that participated
        for (uint256 i = 0; i < activeNodes.length; i++) {
            address nodeAddress = activeNodes[i];
            if (submission.submittedBy[nodeAddress]) {
                OracleNode storage node = oracleNodes[nodeAddress];
                node.successfulVerifications++;
                node.reputation += REPUTATION_REWARD;
                pendingRewards[nodeAddress] += VERIFICATION_REWARD;
            }
        }
    }
    
    function claimRewards() external onlyActiveNode nonReentrant {
        OracleNode storage node = oracleNodes[msg.sender];
        require(block.timestamp >= node.lastRewardClaim + REWARD_CLAIM_COOLDOWN, "Claim cooldown active");
        require(pendingRewards[msg.sender] > 0, "No rewards to claim");
        
        uint256 rewardAmount = pendingRewards[msg.sender];
        pendingRewards[msg.sender] = 0;
        node.lastRewardClaim = block.timestamp;
        
        // Transfer CRUSH tokens as reward
        require(crushToken.transfer(msg.sender, rewardAmount), "Reward transfer failed");
        
        emit RewardClaimed(msg.sender, rewardAmount);
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
    
    function requestFitnessVerification(
        string memory workoutId,
        uint256 expectedDuration,
        uint256 expectedDifficulty
    ) external onlyAuthorizedCaller whenNotPaused {
        // Create verification request that off-chain oracles can respond to
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, workoutId, block.timestamp));
        
        // In production, this would integrate with Chainlink or other oracle networks
        // For now, emit event for off-chain oracle services to pick up
        emit WorkoutVerified(msg.sender, workoutId, false, 0);
    }
    
    function penalizeOracle(address nodeAddress, string memory reason) external onlyOwner {
        require(oracleNodes[nodeAddress].isActive, "Node not active");
        
        OracleNode storage node = oracleNodes[nodeAddress];
        if (node.reputation > REPUTATION_PENALTY) {
            node.reputation -= REPUTATION_PENALTY;
        } else {
            node.reputation = 0;
            node.isActive = false;
            _removeFromActiveNodes(nodeAddress);
        }
        
        emit ReputationUpdated(nodeAddress, node.reputation);
    }
    
    function getOracleStats(address nodeAddress) external view returns (
        bool isActive,
        uint256 reputation,
        uint256 totalVerifications,
        uint256 successfulVerifications,
        uint256 successRate,
        uint256 pendingReward
    ) {
        OracleNode storage node = oracleNodes[nodeAddress];
        uint256 rate = node.totalVerifications > 0 
            ? (node.successfulVerifications * 100) / node.totalVerifications 
            : 0;
            
        return (
            node.isActive,
            node.reputation,
            node.totalVerifications,
            node.successfulVerifications,
            rate,
            pendingRewards[nodeAddress]
        );
    }
    
    function getPendingSubmissions() external view returns (bytes32[] memory) {
        return pendingSubmissions;
    }
    
    function getSubmissionDetails(bytes32 submissionId) external view returns (
        address user,
        string memory workoutId,
        uint256 confirmations,
        bool finalized,
        uint256 timestamp
    ) {
        WorkoutSubmission storage submission = workoutSubmissions[submissionId];
        return (
            submission.user,
            submission.workoutId,
            submission.confirmations,
            submission.finalized,
            submission.timestamp
        );
    }
    
    function getActiveNodesCount() external view returns (uint256) {
        return activeNodes.length;
    }
    
    function updateConsensusRequirement(uint256 newRequirement) external onlyOwner {
        require(newRequirement > 0 && newRequirement <= activeNodes.length, "Invalid consensus requirement");
        // Note: This would require updating the constant, which isn't possible in Solidity
        // In production, make MIN_NODES_FOR_CONSENSUS a state variable instead of constant
    }
    
    function emergencyFinalize(bytes32 submissionId, bool verified) external onlyOwner {
        WorkoutSubmission storage submission = workoutSubmissions[submissionId];
        require(!submission.finalized, "Already finalized");
        require(submission.timestamp > 0, "Submission does not exist");
        
        submission.finalized = true;
        
        if (verified) {
            // Store verified fitness data
            FitnessData storage data = userFitnessData[submission.user][submission.workoutId];
            data.heartRate = submission.expectedHeartRate;
            data.caloriesBurned = submission.expectedCalories;
            data.steps = submission.expectedSteps;
            data.timestamp = submission.timestamp;
            data.verified = true;
            data.confirmations = submission.confirmations;
        }
        
        emit WorkoutVerified(submission.user, submission.workoutId, verified, submission.confirmations);
        _removePendingSubmission(submissionId);
    }
    
    function _isWithinTolerance(uint256 value1, uint256 value2, uint256 tolerancePercent) internal pure returns (bool) {
        uint256 diff = value1 > value2 ? value1 - value2 : value2 - value1;
        uint256 tolerance = (value2 * tolerancePercent) / 100;
        return diff <= tolerance;
    }
    
    function _removeFromActiveNodes(address nodeAddress) internal {
        for (uint256 i = 0; i < activeNodes.length; i++) {
            if (activeNodes[i] == nodeAddress) {
                activeNodes[i] = activeNodes[activeNodes.length - 1];
                activeNodes.pop();
                break;
            }
        }
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
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function withdrawCrushTokens(uint256 amount) external onlyOwner {
        require(crushToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(crushToken.transfer(owner(), amount), "Transfer failed");
    }
    
    // Function to fund the contract with CRUSH tokens for oracle rewards
    function fundOracleRewards(uint256 amount) external onlyOwner {
        require(crushToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
}