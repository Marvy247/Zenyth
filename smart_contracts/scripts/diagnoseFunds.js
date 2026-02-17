const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  
  console.log("🔍 Diagnosing your funds...");
  console.log("Vault:", VAULT_ADDRESS);
  console.log("");

  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  const [signer] = await hre.ethers.getSigners();
  const userAddress = signer.address;
  
  console.log("Your address:", userAddress);
  console.log("");

  // Check user's shares
  const userShares = await vault.userShares(userAddress);
  console.log("📊 Your shares:", hre.ethers.formatEther(userShares));
  
  // Check user's BNB balance in vault
  const userBalance = await vault.getUserBalance(userAddress);
  console.log("💰 Your vault balance:", hre.ethers.formatEther(userBalance), "BNB");
  
  // Check vault's actual BNB balance
  const vaultBNBBalance = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
  console.log("🏦 Vault BNB balance:", hre.ethers.formatEther(vaultBNBBalance), "BNB");
  
  // Check total deposits
  const totalDeposits = await vault.totalDeposits();
  console.log("📈 Total deposits:", hre.ethers.formatEther(totalDeposits), "BNB");
  
  // Check total shares
  const totalShares = await vault.totalShares();
  console.log("🎫 Total shares:", hre.ethers.formatEther(totalShares), "shares");
  
  console.log("\n" + "=".repeat(50));
  
  if (userShares === 0n) {
    console.log("❌ You have no shares in the vault");
    console.log("   You need to deposit first before you can withdraw");
  } else if (vaultBNBBalance === 0n) {
    console.log("⚠️  The vault is empty!");
    console.log("   Your funds were rebalanced to a protocol.");
    
    // Check rebalance history
    const rebalanceCount = await vault.getRebalanceCount();
    console.log(`\n📜 Found ${rebalanceCount} rebalances:`);
    
    for (let i = 0; i < rebalanceCount; i++) {
      const rebalance = await vault.rebalanceHistory(i);
      console.log(`\n  Rebalance #${i + 1}:`);
      console.log(`    Amount: ${hre.ethers.formatEther(rebalance.amount)} BNB`);
      console.log(`    Protocol: ${rebalance.targetProtocol}`);
      console.log(`    Vibe Score: ${rebalance.vibeScore}`);
      console.log(`    Time: ${new Date(Number(rebalance.timestamp) * 1000).toLocaleString()}`);
    }
    
    console.log("\n💡 To recover your funds:");
    console.log("   The protocol needs to return funds to the vault.");
    console.log("   This requires the protocol adapter to have a withdraw function.");
    
  } else if (vaultBNBBalance < userBalance) {
    console.log("⚠️  Partial funds available");
    console.log(`   You have ${hre.ethers.formatEther(userBalance)} BNB in shares`);
    console.log(`   But vault only has ${hre.ethers.formatEther(vaultBNBBalance)} BNB`);
    console.log(`   Missing: ${hre.ethers.formatEther(userBalance - vaultBNBBalance)} BNB (in protocol)`);
    console.log("\n💡 You can withdraw up to:", hre.ethers.formatEther(vaultBNBBalance), "BNB");
    
  } else {
    console.log("✅ All funds are available in the vault");
    console.log("   You should be able to withdraw normally");
    
    // Calculate max withdrawable
    if (totalShares > 0n) {
      const maxShares = userShares;
      const maxBNB = (maxShares * totalDeposits) / totalShares;
      console.log(`\n📤 Max you can withdraw: ${hre.ethers.formatEther(maxBNB)} BNB`);
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("\n🔧 Troubleshooting tips:");
  console.log("   1. Make sure you're connected with the correct wallet");
  console.log("   2. Check that you have shares (deposited previously)");
  console.log("   3. If funds are in a protocol, they need to be withdrawn back");
  console.log("   4. The vault owner can trigger protocol withdrawals");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
