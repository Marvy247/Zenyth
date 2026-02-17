const hre = require("hardhat");

async function main() {
  // Old vault address where you deposited
  const OLD_VAULT_ADDRESS = "0xd8b4875b61130D651409d26C47D49f57BEbC1780";
  
  console.log("💰 Withdrawing from old vault...");
  console.log("Old Vault:", OLD_VAULT_ADDRESS);

  const [user] = await hre.ethers.getSigners();
  console.log("Your address:", user.address);

  // Connect to old vault
  const vault = await hre.ethers.getContractAt("ZenythVault", OLD_VAULT_ADDRESS);
  
  // Check your shares
  const shares = await vault.userShares(user.address);
  console.log("Your shares:", shares.toString());
  
  if (shares == 0) {
    console.log("❌ No shares to withdraw");
    return;
  }

  // Check your balance
  const balanceBefore = await vault.getUserBalance(user.address);
  console.log("Balance to withdraw:", hre.ethers.formatEther(balanceBefore), "BNB");

  // Withdraw all shares
  console.log("📝 Withdrawing...");
  const tx = await vault.withdraw(shares);
  await tx.wait();
  
  console.log("✅ Withdrawn successfully!");
  
  // Check new balance
  const balanceAfter = await hre.ethers.provider.getBalance(user.address);
  console.log("Your wallet balance:", hre.ethers.formatEther(balanceAfter), "BNB");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
