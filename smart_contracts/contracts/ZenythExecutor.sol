// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IProtocolAdapter {
    function supply(uint256 amount) external returns (uint256);
    function withdraw(uint256 amount) external returns (uint256);
    function getAPY() external view returns (uint256);
}

contract ZenythExecutor is Ownable {
    address public zenythVault;
    
    mapping(string => address) public protocolAdapters;
    
    event ProtocolExecuted(string protocol, uint256 amount, uint256 apy);
    
    constructor(address _vault) Ownable(msg.sender) {
        zenythVault = _vault;
    }
    
    function executeStrategy(
        string memory protocolName,
        uint256 amount
    ) external returns (uint256) {
        require(msg.sender == zenythVault, "Zenyth: only vault");
        
        address adapter = protocolAdapters[protocolName];
        require(adapter != address(0), "Zenyth: adapter not found");
        
        IProtocolAdapter protocol = IProtocolAdapter(adapter);
        uint256 result = protocol.supply(amount);
        
        emit ProtocolExecuted(protocolName, amount, protocol.getAPY());
        return result;
    }
    
    function registerAdapter(string memory name, address adapter) external onlyOwner {
        protocolAdapters[name] = adapter;
    }
    
    function getProtocolAPY(string memory name) external view returns (uint256) {
        address adapter = protocolAdapters[name];
        if (adapter == address(0)) return 0;
        return IProtocolAdapter(adapter).getAPY();
    }
    
    // Allow contract to receive BNB
    receive() external payable {}
}
