// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZenythVault is ReentrancyGuard, Ownable {
    uint256 public totalDeposits;
    uint256 public totalShares;
    address public zenythAgent;
    
    mapping(address => uint256) public userShares;
    mapping(address => bool) public approvedProtocols;
    
    struct VibeRebalance {
        uint256 timestamp;
        uint256 vibeScore;
        address targetProtocol;
        uint256 amount;
        bytes32 txHash;
    }
    
    VibeRebalance[] public rebalanceHistory;
    
    event ZenythDeposit(address indexed user, uint256 amount, uint256 shares);
    event ZenythWithdraw(address indexed user, uint256 shares, uint256 amount);
    event VibeRebalanceExecuted(uint256 vibeScore, address protocol, uint256 amount);
    event AgentUpdated(address newAgent);
    
    modifier onlyAgent() {
        require(msg.sender == zenythAgent, "Zenyth: caller not agent");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        zenythAgent = msg.sender;
    }
    
    function deposit() external payable nonReentrant returns (uint256 shares) {
        require(msg.value > 0, "Zenyth: zero deposit");
        
        if (totalShares == 0) {
            shares = msg.value;
        } else {
            shares = (msg.value * totalShares) / totalDeposits;
        }
        
        userShares[msg.sender] += shares;
        totalShares += shares;
        totalDeposits += msg.value;
        
        emit ZenythDeposit(msg.sender, msg.value, shares);
        return shares;
    }
    
    function withdraw(uint256 shares) external nonReentrant returns (uint256 amount) {
        require(shares > 0 && userShares[msg.sender] >= shares, "Zenyth: invalid shares");
        
        amount = (shares * totalDeposits) / totalShares;
        
        userShares[msg.sender] -= shares;
        totalShares -= shares;
        totalDeposits -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Zenyth: transfer failed");
        
        emit ZenythWithdraw(msg.sender, shares, amount);
        return amount;
    }
    
    function executeVibeRebalance(
        uint256 vibeScore,
        address targetProtocol,
        uint256 amount
    ) external onlyAgent nonReentrant {
        require(approvedProtocols[targetProtocol], "Zenyth: protocol not approved");
        require(amount <= address(this).balance, "Zenyth: insufficient balance");
        
        (bool success, ) = targetProtocol.call{value: amount}("");
        require(success, "Zenyth: rebalance failed");
        
        rebalanceHistory.push(VibeRebalance({
            timestamp: block.timestamp,
            vibeScore: vibeScore,
            targetProtocol: targetProtocol,
            amount: amount,
            txHash: blockhash(block.number - 1)
        }));
        
        emit VibeRebalanceExecuted(vibeScore, targetProtocol, amount);
    }
    
    function setZenythAgent(address newAgent) external onlyOwner {
        zenythAgent = newAgent;
        emit AgentUpdated(newAgent);
    }
    
    function approveProtocol(address protocol, bool approved) external onlyOwner {
        approvedProtocols[protocol] = approved;
    }
    
    function getRebalanceCount() external view returns (uint256) {
        return rebalanceHistory.length;
    }
    
    function getUserBalance(address user) external view returns (uint256) {
        if (totalShares == 0) return 0;
        return (userShares[user] * totalDeposits) / totalShares;
    }
    
    receive() external payable {}
}
