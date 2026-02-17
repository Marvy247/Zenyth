const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  
  console.log("🔍 Checking vault and looking for funds in protocols...");
  console.log("Vault:", VAULT_ADDRESS);
  console.log("");

  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  const [signer] = await hre.ethers.getSigners();
  
  // Check vault balance
  const vaultBalance = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
  console.log("💰 Vault BNB balance:", hre.ethers.formatEther(vaultBalance), "BNB");
  
  // Check rebalance history to find where funds went
  const rebalanceCount = await vault.getRebalanceCount();
  console.log("\n📜 Rebalance History (" + rebalanceCount + " total):");
  
  if (rebalanceCount === 0) {
    console.log("   No rebalances found");
    return;
  }
  
  // Get the last few rebalances
  const protocols = new Set();
  const count = Number(rebalanceCount);
  for (let i = 0; i < Math.min(5, count); i++) {
    const index = BigInt(count - 1 - i);
    const rebalance = await vault.rebalanceHistory(index);
    console.log(`\n  Rebalance #${count - i}:`);
    console.log(`    Protocol: ${rebalance.targetProtocol}`);
    console.log(`    Amount: ${hre.ethers.formatEther(rebalance.amount)} BNB`);
    protocols.add(rebalance.targetProtocol);
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("\n🔧 Recovery Options:");
  
  if (vaultBalance > 0n) {
    console.log(`\n✅ Vault has ${hre.ethers.formatEther(vaultBalance)} BNB available`);
    console.log("   You can withdraw this amount immediately");
  } else {
    console.log("\n❌ Vault is empty");
    console.log("   Funds are in the protocol(s) listed above");
  }
  
  console.log("\n💡 To recover all funds:");
  console.log("   1. The protocol adapter needs a 'withdraw' function");
  console.log("   2. The vault owner can call it to return funds");
  console.log("   3. Then users can withdraw from the vault");
  
  // Check if we can interact with any protocol
  for (const protocol of protocols) {
    console.log(`\n🔍 Checking protocol: ${protocol}`);
    try {
      const code = await hre.ethers.provider.getCode(protocol);
      if (code === '0x') {
        console.log("   ⚠️  This appears to be an EOA (wallet), not a contract");
      } else {
        console.log("   ✓  This is a contract");
        console.log("   Code size:", code.length, "bytes");
      }
    } catch (e) {
      console.log("   Error checking protocol:", e.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
