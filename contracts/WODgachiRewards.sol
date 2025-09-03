// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20Simple {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface INFTSimple {
    function ownerOf(uint256 tokenId) external view returns (address);
    function redeemNFT(uint256 tokenId, string memory rewardId) external;
}

contract WODgachiRewards {
    address public owner;
    IERC20Simple public crushToken;
    INFTSimple public progressNFT;
    
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
    
    event RewardRedeemed(address indexed user, string rewardId, bool usedNFT);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _crushToken, address _progressNFT) {
        owner = msg.sender;
        crushToken = IERC20Simple(_crushToken);
        progressNFT = INFTSimple(_progressNFT);
        
        // Initialize rewards
        rewards["premium-workout"] = Reward("premium-workout", 500 * 10**18, true, 30, true);
        rewards["personal-trainer"] = Reward("personal-trainer", 1000 * 10**18, true, 60, true);
        rewards["nutrition-guide"] = Reward("nutrition-guide", 750 * 10**18, true, 90, true);
        
        rewardCostInXDC["premium-workout"] = 0.5 ether;
        rewardCostInXDC["personal-trainer"] = 1 ether;
        rewardCostInXDC["nutrition-guide"] = 0.75 ether;
    }
    
    function redeemWithCRUSH(string memory rewardId) external {
        require(rewards[rewardId].isActive, "Reward not available");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        
        uint256 cost = rewards[rewardId].crushCost;
        require(crushToken.balanceOf(msg.sender) >= cost, "Insufficient CRUSH");
        require(crushToken.transferFrom(msg.sender, address(this), cost), "Transfer failed");
        
        userRedemptions[msg.sender][rewardId] = true;
        emit RewardRedeemed(msg.sender, rewardId, false);
    }
    
    function redeemWithNFT(string memory rewardId, uint256 nftTokenId) external {
        require(rewards[rewardId].isActive, "Reward not available");
        require(rewards[rewardId].nftRedeemable, "Not redeemable with NFT");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        require(progressNFT.ownerOf(nftTokenId) == msg.sender, "Not NFT owner");
        
        progressNFT.redeemNFT(nftTokenId, rewardId);
        userRedemptions[msg.sender][rewardId] = true;
        
        emit RewardRedeemed(msg.sender, rewardId, true);
    }
    
    function redeemWithXDC(string memory rewardId) external payable {
        require(rewards[rewardId].isActive, "Reward not available");
        require(!userRedemptions[msg.sender][rewardId], "Already redeemed");
        require(msg.value >= rewardCostInXDC[rewardId], "Insufficient XDC");
        
        userRedemptions[msg.sender][rewardId] = true;
        
        if (msg.value > rewardCostInXDC[rewardId]) {
            payable(msg.sender).transfer(msg.value - rewardCostInXDC[rewardId]);
        }
        
        emit RewardRedeemed(msg.sender, rewardId, false);
    }
    
    function getReward(string memory rewardId) external view returns (Reward memory) {
        return rewards[rewardId];
    }
    
    function withdrawXDC() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {}
}