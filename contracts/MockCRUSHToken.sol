// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockCRUSHToken
 * @dev Temporary mock token for Phase 1 deployment
 * This allows testing all functionality before real token launch
 */
contract MockCRUSHToken {
    string public name = "Mock CRUSH Token (Phase 1)";
    string public symbol = "mCRUSH";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public authorizedMinters;
    
    address public owner;
    bool public isActive = true;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokenDeactivated();
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier onlyActive() {
        require(isActive, "Mock token deactivated - upgrade to real CRUSH");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        totalSupply = 1000000 * 10**18; // 1M mock tokens for testing
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address to, uint256 value) public onlyActive returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public onlyActive returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public onlyActive returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        
        emit Transfer(from, to, value);
        return true;
    }
    
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    function rewardWorkout(address user) external onlyMinter onlyActive {
        uint256 reward = 150 * 10**18; // Same as real CRUSH
        totalSupply += reward;
        balanceOf[user] += reward;
        emit Transfer(address(0), user, reward);
    }
    
    // Deactivate mock token when ready to upgrade
    function deactivateToken() external onlyOwner {
        isActive = false;
        emit TokenDeactivated();
    }
    
    // Emergency function to migrate balances to real CRUSH
    function getUserBalance(address user) external view returns (uint256) {
        return balanceOf[user];
    }
}