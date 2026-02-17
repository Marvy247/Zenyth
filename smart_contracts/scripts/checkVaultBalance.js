const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  
  console.log("🔍 Checking vault balance...");
  console.log("Vault:", VAULT_ADDRESS);

  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  const balance = await hre.ethers.provider.getBalance(vault.target);
  
  console.log("💰 Vault balance:", hre.ethers.formatEther(balance), "BNB");
  
  // Also check total deposits
  const totalDeposits = await vault.totalDeposits();
  console.log("📊 Total deposits:", hre.ethers.formatEther(totalDeposits), "BNB");
  
  // Check if we can rebalance
  const minRebalance = 0.01;
  const canRebalance = parseFloat(hre.ethers.formatEther(balance)) >= minRebalance;
  console.log(canRebalance ? "✅ Can rebalance" : "❌ Insufficient balance for rebalance");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
