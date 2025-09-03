// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./WODgachiNFT.sol";

/**
 * @title WODgachiRewards
 * @dev Reward redemption system supporting both CRUSH tokens and NFTs
 */
contract WODgachiRewards is Ownable, Pausable, ReentrancyGuard {
    IERC20 public crushToken;
    WODgachiNFT public progressNFT;
    
    struct Reward {
        string id;
        uint256 crushCost;
        bool nftRedeemable;
        uint256 requiredMilestone;
        bool isActive;
    }
    
    mapping(string => Reward) public rewards;
    mapping(address => mapping(string => bool)) public userRedemptions;
    mapping(string => uint256) public rewardCostInXDC;
    
    string[] public availableRewards;
    
    event RewardRedeemed(address indexed user, string rewardId, bool usedNFT, uint256 nftTokenId);
    event RewardAdded(string rewardId, uint256 crushCost, bool nftRedeemable);
    event RewardUpdated(string rewardId, uint256 newCost);
    event XDCRedemption(address indexed user, string rewardId, uint256 xdcAmount);
    
    constructor(address _crushToken, address _progressNFT) Ownable(msg.sender) {
        crushToken = IERC20(_crushToken);
        progressNFT = WODgachiNFT(_progressNFT);
        
        // Initialize default rewards
        _addReward("premium-workout", 500 * 10**18, true, 30);
        _addReward("personal-trainer", 1000 * 10**18, true, 60);
        _addReward("nutrition-guide", 750 * 10**18, true, 90);
        _addReward("equipment-discount", 300 * 10**18, false, 0);
        _addReward("streak-booster", 200 * 10**18, false, 0);
        _addReward("double-points", 400 * 10**18, false, 0);
        
        // Set XDC costs (1000 CRUSH = 1 XDC for testnet convenience)
        rewardCostInXDC["premium-workout"] = 0.5 ether;
        rewardCostInXDC["personal-trainer"] = 1 ether;
        rewardCostInXDC["nutrition-guide"] = 0.75 ether;
        rewardCostInXDC["equipment-discount"] = 0.3 ether;
        rewardCostInXDC["streak-booster"] = 0.2 ether;
        rewardCostInXDC["double-points"] = 0.4 ether;
    }
    
    function redeemWithCRUSH(string memory rewardId) external whenNotPaused nonReentrant {
        require(rewards[rewardId].isActive, "Reward not available");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        
        uint256 cost = rewards[rewardId].crushCost;
        require(crushToken.balanceOf(msg.sender) >= cost, "Insufficient CRUSH tokens");
        require(crushToken.transferFrom(msg.sender, address(this), cost), "Transfer failed");
        
        userRedemptions[msg.sender][rewardId] = true;
        
        emit RewardRedeemed(msg.sender, rewardId, false, 0);
    }
    
    function redeemWithNFT(string memory rewardId, uint256 nftTokenId) external whenNotPaused nonReentrant {
        require(rewards[rewardId].isActive, "Reward not available");
        require(rewards[rewardId].nftRedeemable, "Reward not redeemable with NFT");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        require(progressNFT.ownerOf(nftTokenId) == msg.sender, "Not owner of NFT");
        
        // Get NFT metadata to check milestone requirement
        WODgachiNFT.ProgressMetadata memory metadata = progressNFT.getProgressMetadata(nftTokenId);
        require(!metadata.isRedeemed, "NFT already redeemed");
        require(metadata.workoutsMilestone >= rewards[rewardId].requiredMilestone, "NFT milestone too low");
        
        // Mark NFT as redeemed
        progressNFT.redeemNFT(nftTokenId, rewardId);
        userRedemptions[msg.sender][rewardId] = true;
        
        emit RewardRedeemed(msg.sender, rewardId, true, nftTokenId);
    }
    
    function redeemWithXDC(string memory rewardId) external payable whenNotPaused nonReentrant {
        require(rewards[rewardId].isActive, "Reward not available");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        require(rewardCostInXDC[rewardId] > 0, "XDC redemption not available");
        require(msg.value >= rewardCostInXDC[rewardId], "Insufficient XDC sent");
        
        userRedemptions[msg.sender][rewardId] = true;
        
        // Refund excess XDC
        if (msg.value > rewardCostInXDC[rewardId]) {
            payable(msg.sender).transfer(msg.value - rewardCostInXDC[rewardId]);
        }
        
        emit XDCRedemption(msg.sender, rewardId, rewardCostInXDC[rewardId]);
        emit RewardRedeemed(msg.sender, rewardId, false, 0);
    }
    
    function addReward(
        string memory rewardId,
        uint256 crushCost,
        bool nftRedeemable,
        uint256 requiredMilestone
    ) external onlyOwner {
        _addReward(rewardId, crushCost, nftRedeemable, requiredMilestone);
    }
    
    function _addReward(
        string memory rewardId,
        uint256 crushCost,
        bool nftRedeemable,
        uint256 requiredMilestone
    ) internal {
        require(bytes(rewardId).length > 0, "Invalid reward ID");
        require(!rewards[rewardId].isActive, "Reward already exists");
        
        rewards[rewardId] = Reward({
            id: rewardId,
            crushCost: crushCost,
            nftRedeemable: nftRedeemable,
            requiredMilestone: requiredMilestone,
            isActive: true
        });
        
        availableRewards.push(rewardId);
        
        emit RewardAdded(rewardId, crushCost, nftRedeemable);
    }
    
    function updateRewardCost(string memory rewardId, uint256 newCost) external onlyOwner {
        require(rewards[rewardId].isActive, "Reward does not exist");
        rewards[rewardId].crushCost = newCost;
        emit RewardUpdated(rewardId, newCost);
    }
    
    function setRewardXDCCost(string memory rewardId, uint256 xdcCost) external onlyOwner {
        require(rewards[rewardId].isActive, "Reward does not exist");
        rewardCostInXDC[rewardId] = xdcCost;
    }
    
    function deactivateReward(string memory rewardId) external onlyOwner {
        rewards[rewardId].isActive = false;
    }
    
    function getReward(string memory rewardId) external view returns (Reward memory) {
        return rewards[rewardId];
    }
    
    function getRewardCostInXDC(string memory rewardId) external view returns (uint256) {
        return rewardCostInXDC[rewardId];
    }
    
    function getAvailableRewards() external view returns (string[] memory) {
        return availableRewards;
    }
    
    function hasUserRedeemed(address user, string memory rewardId) external view returns (bool) {
        return userRedemptions[user][rewardId];
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdrawCRUSH(uint256 amount) external onlyOwner {
        require(crushToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(crushToken.transfer(owner(), amount), "Transfer failed");
    }
    
    function withdrawXDC() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
}