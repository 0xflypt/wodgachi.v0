// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title WODgachiNFT
 * @dev NFT contract for minting workout milestone achievements
 */
contract WODgachiNFT is ERC721, ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
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
    mapping(address => bool) public authorizedMinters;
    
    event ProgressNFTMinted(
        address indexed user, 
        uint256 indexed tokenId, 
        uint256 workoutsMilestone,
        uint256 level,
        uint256 streak
    );
    event NFTRedeemed(address indexed user, uint256 indexed tokenId, string rewardId);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    constructor() ERC721("WODgachi Progress NFT", "WODPROG") Ownable(msg.sender) {
        _tokenIdCounter.increment(); // Start from token ID 1
    }
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    function mintProgressNFT(
        address to,
        uint256 totalWorkouts,
        uint256 level,
        uint256 streak,
        uint256 tokensEarned,
        string memory creatureName,
        uint256 creatureLevel,
        string memory tokenURI
    ) external onlyAuthorizedMinter whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        require(totalWorkouts >= 30, "Minimum 30 workouts required");
        
        uint256 workoutsMilestone = (totalWorkouts / 30) * 30;
        require(!hasMintedMilestone[to][workoutsMilestone], "Milestone already minted");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
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
        
        emit ProgressNFTMinted(to, tokenId, workoutsMilestone, level, streak);
        
        return tokenId;
    }
    
    function redeemNFT(uint256 tokenId, string memory rewardId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this NFT");
        require(!progressMetadata[tokenId].isRedeemed, "NFT already redeemed");
        
        progressMetadata[tokenId].isRedeemed = true;
        progressMetadata[tokenId].redeemedFor = rewardId;
        
        emit NFTRedeemed(msg.sender, tokenId, rewardId);
    }
    
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }
    
    function getProgressMetadata(uint256 tokenId) external view returns (ProgressMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return progressMetadata[tokenId];
    }
    
    function canMintMilestone(address user, uint256 totalWorkouts) external view returns (bool) {
        if (totalWorkouts < 30) return false;
        uint256 workoutsMilestone = (totalWorkouts / 30) * 30;
        return !hasMintedMilestone[user][workoutsMilestone];
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Override required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}