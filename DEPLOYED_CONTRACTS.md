# Deployed Contracts - BNB Chain Testnet

## Contract Addresses

| Contract | Address | Explorer Link |
|----------|---------|---------------|
| **ZenythVault** | `0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925` | [View on BscScan](https://testnet.bscscan.com/address/0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925) |
| **ZenythExecutor** | `0xc6dFd5ad02d877582A4c81840Ab4E944c608021a` | [View on BscScan](https://testnet.bscscan.com/address/0xc6dFd5ad02d877582A4c81840Ab4E944c608021a) |

## Network Configuration

- **Network**: BNB Chain Testnet (tBNB)
- **Chain ID**: 97
- **RPC URL**: https://data-seed-prebsc-1-s1.bnbchain.org:8545
- **Explorer**: https://testnet.bscscan.com

## Files Updated with Hardcoded Addresses

### 1. Frontend Configuration
**File**: `frontend/src/lib/wagmi.ts`
- Updated `ZENYTH_VAULT_ADDRESS` to `0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925`
- Updated `ZENYTH_EXECUTOR_ADDRESS` to `0xc6dFd5ad02d877582A4c81840Ab4E944c608021a`
- Changed network from opBNB to BSC Testnet

### 2. Agent Core
**File**: `agent_core/ZenythAgent.js`
- Hardcoded vault address: `0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925`
- Hardcoded RPC URL: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`
- Hardcoded protocol addresses for Venus, PancakeSwap

### 3. Smart Contract Configuration
**File**: `smart_contracts/hardhat.config.js`
- Updated network configuration for BNB Chain Testnet
- Chain ID: 97
- RPC: https://data-seed-prebsc-1-s1.bnbchain.org:8545

## Contract Details

### ZenythVault
- **Purpose**: Main vault for deposits, withdrawals, and vibe-aware rebalancing
- **Features**:
  - Shares-based accounting
  - Deposit and withdraw functions
  - `executeVibeRebalance()` for AI-driven rebalancing
  - Event logging for transparency

### ZenythExecutor
- **Purpose**: Strategy executor with protocol adapter registry
- **Features**:
  - Protocol adapter registration
  - Strategy execution interface
  - APY fetching from multiple protocols

## Verification

To verify the contracts are deployed:

1. Visit the explorer links above
2. Check that the contracts have bytecode
3. Verify the contract source code on BscScan if needed

## Next Steps

1. **Verify Contracts**: Submit source code to BscScan for verification
2. **Test Functions**: Test deposit, withdraw, and rebalance functions
3. **Update Frontend**: Ensure frontend connects to correct network
4. **Test Agent**: Run Telegram bot and test all commands

## Deployment Log

```
🚀 Deploying Zenyth contracts to BNB Chain testnet...
Deployer: 0x27A2dD1823D883935c9824fbaC0a018cE8e891E5
Balance: 0.3 BNB
✅ ZenythVault deployed: 0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925
✅ ZenythExecutor deployed: 0xc6dFd5ad02d877582A4c81840Ab4E944c608021a
```

---

**Deployed**: February 2026  
**Network**: BNB Chain Testnet  
**Status**: ✅ Active
