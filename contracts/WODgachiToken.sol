// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title WODgachiToken (CRUSH)
 * @dev ERC20 token for WODgachi fitness rewards
 */
contract WODgachiToken is ERC20, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant WORKOUT_REWARD = 150 * 10**18; // 150 CRUSH per workout
    uint256 public constant STREAK_BONUS = 50 * 10**18; // 50 CRUSH streak bonus
    
    mapping(address => bool) public authorizedMinters;
    mapping(address => uint256) public lastWorkoutTimestamp;
    mapping(address => uint256) public streakCount;
    
    event WorkoutCompleted(address indexed user, uint256 reward, uint256 streakBonus);
    event StreakBroken(address indexed user, uint256 previousStreak);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    constructor() ERC20("WODgachi CRUSH Token", "CRUSH") Ownable(msg.sender) {
        _mint(msg.sender, 10000000 * 10**18); // Initial supply for rewards pool
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    function rewardWorkout(address user) external onlyAuthorizedMinter whenNotPaused {
        require(user != address(0), "Invalid user address");
        require(totalSupply() + WORKOUT_REWARD <= MAX_SUPPLY, "Max supply exceeded");
        
        uint256 reward = WORKOUT_REWARD;
        uint256 streakBonus = 0;
        
        // Check if workout maintains streak (within 48 hours)
        if (lastWorkoutTimestamp[user] > 0) {
            uint256 timeSinceLastWorkout = block.timestamp - lastWorkoutTimestamp[user];
            
            if (timeSinceLastWorkout <= 48 hours) {
                streakCount[user]++;
                if (streakCount[user] >= 7) {
                    streakBonus = STREAK_BONUS;
                }
            } else {
                emit StreakBroken(user, streakCount[user]);
                streakCount[user] = 1;
            }
        } else {
            streakCount[user] = 1;
        }
        
        lastWorkoutTimestamp[user] = block.timestamp;
        
        _mint(user, reward + streakBonus);
        emit WorkoutCompleted(user, reward, streakBonus);
    }
    
    function getUserStreak(address user) external view returns (uint256) {
        if (lastWorkoutTimestamp[user] == 0) return 0;
        
        uint256 timeSinceLastWorkout = block.timestamp - lastWorkoutTimestamp[user];
        if (timeSinceLastWorkout > 48 hours) {
            return 0;
        }
        
        return streakCount[user];
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