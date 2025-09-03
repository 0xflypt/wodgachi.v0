// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WODgachiNFT {
    string public name = "WODgachi Progress NFT";
    string public symbol = "WODPROG";
    
    uint256 private _tokenIdCounter = 1;
    address public owner;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(address => bool) public authorizedMinters;
    
    struct ProgressMetadata {
        uint256 totalWorkouts;
        uint256 level;
        uint256 streak;
        uint256 tokensEarned;
        string creatureName;
        uint256 creatureLevel;
        uint256 mintedAt;
        uint256 workoutsMilestone;
        bool isRedeemed;
        string redeemedFor;
    }
    
    mapping(uint256 => ProgressMetadata) public progressMetadata;
    mapping(address => uint256[]) public userNFTs;
    mapping(address => mapping(uint256 => bool)) public hasMintedMilestone;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event ProgressNFTMinted(address indexed user, uint256 indexed tokenId, uint256 workoutsMilestone);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    function mintProgressNFT(
        address to,
        uint256 totalWorkouts,
        uint256 level,
        uint256 streak,
        uint256 tokensEarned,
        string memory creatureName,
        uint256 creatureLevel,
        string memory metadataURI
    ) external onlyMinter returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(totalWorkouts >= 30, "Minimum 30 workouts required");
        
        uint256 workoutsMilestone = (totalWorkouts / 30) * 30;
        require(!hasMintedMilestone[to][workoutsMilestone], "Milestone already minted");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        
        progressMetadata[tokenId] = ProgressMetadata({
            totalWorkouts: totalWorkouts,
            level: level,
            streak: streak,
            tokensEarned: tokensEarned,
            creatureName: creatureName,
            creatureLevel: creatureLevel,
            mintedAt: block.timestamp,
            workoutsMilestone: workoutsMilestone,
            isRedeemed: false,
            redeemedFor: ""
        });
        
        userNFTs[to].push(tokenId);
        hasMintedMilestone[to][workoutsMilestone] = true;
        
        emit Transfer(address(0), to, tokenId);
        emit ProgressNFTMinted(to, tokenId, workoutsMilestone);
        
        return tokenId;
    }
    
    function redeemNFT(uint256 tokenId, string memory rewardId) external {
        require(ownerOf[tokenId] == msg.sender, "Not owner");
        require(!progressMetadata[tokenId].isRedeemed, "Already redeemed");
        
        progressMetadata[tokenId].isRedeemed = true;
        progressMetadata[tokenId].redeemedFor = rewardId;
    }
    
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }
    
    function getProgressMetadata(uint256 tokenId) external view returns (ProgressMetadata memory) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return progressMetadata[tokenId];
    }
    
    function approve(address to, uint256 tokenId) external {
        require(ownerOf[tokenId] == msg.sender, "Not owner");
        getApproved[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }
    
    function transferFrom(address from, address to, uint256 tokenId) external {
        require(ownerOf[tokenId] == from, "Not owner");
        require(
            msg.sender == from || 
            getApproved[tokenId] == msg.sender || 
            isApprovedForAll[from][msg.sender], 
            "Not approved"
        );
        
        ownerOf[tokenId] = to;
        balanceOf[from]--;
        balanceOf[to]++;
        getApproved[tokenId] = address(0);
        
        emit Transfer(from, to, tokenId);
    }
}