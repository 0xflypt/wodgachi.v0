// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./WODgachiToken.sol";
import "./WODgachiNFT.sol";

/**
 * @title WODgachiRewards
 * @dev Contract for managing reward redemptions with CRUSH tokens and NFTs
 */
contract WODgachiRewards is Ownable, Pausable, ReentrancyGuard {
    WODgachiToken public crushToken;
    WODgachiNFT public progressNFT;
    
    struct Reward {
        string id;
        string title;
        string description;
        uint256 crushCost;
        uint256 nftMilestoneRequired;
        bool isActive;
        bool nftRedeemable;
        uint256 totalRedeemed;
        uint256 maxRedemptions;
    }
    
    mapping(string => Reward) public rewards;
    mapping(address => mapping(string => bool)) public userRedemptions;
    mapping(address => mapping(string => uint256)) public userRedemptionCount;
    
    string[] public activeRewardIds;
    
    event RewardAdded(string indexed rewardId, uint256 crushCost, uint256 nftMilestone);
    event RewardRedeemed(address indexed user, string indexed rewardId, bool usedNFT, uint256 nftTokenId);
    event RewardUpdated(string indexed rewardId, uint256 newCost, bool isActive);
    event XDCPaymentReceived(address indexed user, string indexed rewardId, uint256 amount);
    
    constructor(address _crushToken, address _progressNFT) Ownable(msg.sender) {
        crushToken = WODgachiToken(_crushToken);
        progressNFT = WODgachiNFT(_progressNFT);
        
        // Initialize default rewards
        _addReward("premium-workout", "Premium Workout Pack", "10 exclusive advanced workouts", 500 * 10**18, 30, true, true, 1000);
        _addReward("personal-trainer", "1-on-1 Virtual Session", "30-minute certified trainer session", 1000 * 10**18, 60, true, true, 100);
        _addReward("nutrition-guide", "Custom Nutrition Plan", "Personalized meal plans", 750 * 10**18, 90, true, true, 500);
        _addReward("equipment-discount", "20% Equipment Discount", "Fitness equipment discount code", 300 * 10**18, 0, false, true, 2000);
        _addReward("streak-booster", "Streak Shield", "Protect streak for 3 days", 200 * 10**18, 0, false, true, 5000);
        _addReward("double-points", "Double Points Weekend", "2x points for 48 hours", 400 * 10**18, 0, false, true, 1000);
    }
    
    function _addReward(
        string memory id,
        string memory title,
        string memory description,
        uint256 crushCost,
        uint256 nftMilestone,
        bool nftRedeemable,
        bool isActive,
        uint256 maxRedemptions
    ) internal {
        rewards[id] = Reward({
            id: id,
            title: title,
            description: description,
            crushCost: crushCost,
            nftMilestoneRequired: nftMilestone,
            isActive: isActive,
            nftRedeemable: nftRedeemable,
            totalRedeemed: 0,
            maxRedemptions: maxRedemptions
        });
        
        activeRewardIds.push(id);
        emit RewardAdded(id, crushCost, nftMilestone);
    }
    
    function addReward(
        string memory id,
        string memory title,
        string memory description,
        uint256 crushCost,
        uint256 nftMilestone,
        bool nftRedeemable,
        uint256 maxRedemptions
    ) external onlyOwner {
        require(bytes(rewards[id].id).length == 0, "Reward already exists");
        _addReward(id, title, description, crushCost, nftMilestone, nftRedeemable, true, maxRedemptions);
    }
    
    function redeemWithCRUSH(string memory rewardId) external whenNotPaused nonReentrant {
        Reward storage reward = rewards[rewardId];
        require(reward.isActive, "Reward not active");
        require(reward.totalRedeemed < reward.maxRedemptions, "Reward sold out");
        
        // For testnet: Allow payment with either CRUSH tokens OR native XDC
        bool hasCRUSH = crushToken.balanceOf(msg.sender) >= reward.crushCost;
        uint256 xdcCost = reward.crushCost / 1000; // 1000 CRUSH = 1 XDC for testing
        bool hasXDC = msg.value >= xdcCost;
        
        require(hasCRUSH || hasXDC, "Insufficient CRUSH tokens or XDC");
        
        if (hasCRUSH && msg.value == 0) {
            // Use CRUSH tokens
            crushToken.transferFrom(msg.sender, address(this), reward.crushCost);
        } else if (hasXDC) {
            // Use XDC (for testnet convenience)
            // XDC is automatically transferred via msg.value
        } else {
            revert("Payment method not available");
        }
        
        userRedemptions[msg.sender][rewardId] = true;
        userRedemptionCount[msg.sender][rewardId]++;
        reward.totalRedeemed++;
        
        emit RewardRedeemed(msg.sender, rewardId, false, 0);
    }
    
    function redeemWithNFT(string memory rewardId, uint256 nftTokenId) external whenNotPaused nonReentrant {
        Reward storage reward = rewards[rewardId];
        require(reward.isActive, "Reward not active");
        require(reward.nftRedeemable, "Reward not redeemable with NFT");
        require(reward.totalRedeemed < reward.maxRedemptions, "Reward sold out");
        require(progressNFT.ownerOf(nftTokenId) == msg.sender, "Not owner of NFT");
        
        // Get NFT metadata to check milestone
        WODgachiNFT.ProgressMetadata memory metadata = progressNFT.getProgressMetadata(nftTokenId);
        require(!metadata.isRedeemed, "NFT already redeemed");
        require(metadata.workoutsMilestone >= reward.nftMilestoneRequired, "NFT milestone insufficient");
        
        // Mark NFT as redeemed
        progressNFT.redeemNFT(nftTokenId, rewardId);
        
        userRedemptions[msg.sender][rewardId] = true;
        userRedemptionCount[msg.sender][rewardId]++;
        reward.totalRedeemed++;
        
        emit RewardRedeemed(msg.sender, rewardId, true, nftTokenId);
    }
    
    function canRedeemWithNFT(address user, string memory rewardId) external view returns (bool, uint256[] memory eligibleNFTs) {
        Reward memory reward = rewards[rewardId];
        if (!reward.nftRedeemable || !reward.isActive) {
            return (false, new uint256[](0));
        }
        
        uint256[] memory userNFTIds = progressNFT.getUserNFTs(user);
        uint256[] memory eligible = new uint256[](userNFTIds.length);
        uint256 eligibleCount = 0;
        
        for (uint256 i = 0; i < userNFTIds.length; i++) {
            WODgachiNFT.ProgressMetadata memory metadata = progressNFT.getProgressMetadata(userNFTIds[i]);
            if (!metadata.isRedeemed && metadata.workoutsMilestone >= reward.nftMilestoneRequired) {
                eligible[eligibleCount] = userNFTIds[i];
                eligibleCount++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](eligibleCount);
        for (uint256 i = 0; i < eligibleCount; i++) {
            result[i] = eligible[i];
        }
        
        return (eligibleCount > 0, result);
    }
    
    function updateReward(
        string memory rewardId,
        uint256 newCrushCost,
        uint256 newNftMilestone,
        bool isActive
    ) external onlyOwner {
        require(bytes(rewards[rewardId].id).length > 0, "Reward does not exist");
        
        rewards[rewardId].crushCost = newCrushCost;
        rewards[rewardId].nftMilestoneRequired = newNftMilestone;
        rewards[rewardId].isActive = isActive;
        
        emit RewardUpdated(rewardId, newCrushCost, isActive);
    }
    
    function getActiveRewards() external view returns (string[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < activeRewardIds.length; i++) {
            if (rewards[activeRewardIds[i]].isActive) {
                activeCount++;
            }
        }
        
        string[] memory active = new string[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < activeRewardIds.length; i++) {
            if (rewards[activeRewardIds[i]].isActive) {
                active[index] = activeRewardIds[i];
                index++;
            }
        }
        
        return active;
    }
    
    function getUserRedemptionHistory(address user) external view returns (
        string[] memory rewardIds,
        uint256[] memory counts
    ) {
        uint256 redeemedCount = 0;
        for (uint256 i = 0; i < activeRewardIds.length; i++) {
            if (userRedemptions[user][activeRewardIds[i]]) {
                redeemedCount++;
            }
        }
        
        rewardIds = new string[](redeemedCount);
        counts = new uint256[](redeemedCount);
        
        uint256 index = 0;
        for (uint256 i = 0; i < activeRewardIds.length; i++) {
            string memory rewardId = activeRewardIds[i];
            if (userRedemptions[user][rewardId]) {
                rewardIds[index] = rewardId;
                counts[index] = userRedemptionCount[user][rewardId];
                index++;
            }
        }
        
        return (rewardIds, counts);
    }
    
    function getRewardCostInXDC(string memory rewardId) external view returns (uint256) {
        return rewards[rewardId].crushCost / 1000; // 1000 CRUSH = 1 XDC for testing
    }
    
    function withdrawXDC() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function withdrawCRUSH(uint256 amount) external onlyOwner {
        require(crushToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        crushToken.transfer(owner(), amount);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}