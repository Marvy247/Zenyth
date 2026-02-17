const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  const PROTOCOL_ADDRESS = "0xc6dFd5ad02d877582A4c81840Ab4E944c608021a";
  
  console.log("🔧 Withdrawing funds from protocol back to vault...");
  console.log("Vault:", VAULT_ADDRESS);
  console.log("Protocol:", PROTOCOL_ADDRESS);
  console.log("");

  const [signer] = await hre.ethers.getSigners();
  console.log("Using signer:", signer.address);
  
  // Check initial balances
  const vaultInitialBalance = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
  console.log("💰 Vault balance before:", hre.ethers.formatEther(vaultInitialBalance), "BNB");
  
  // Get the protocol contract
  const protocol = await hre.ethers.getContractAt("IProtocolAdapter", PROTOCOL_ADDRESS);
  
  try {
    // Try to call withdraw function on the protocol
    console.log("\n📤 Calling protocol.withdraw()...");
    
    // Check if the protocol has a withdraw function
    const withdrawTx = await protocol.withdraw(vaultInitialBalance);
    await withdrawTx.wait();
    
    console.log("✅ Withdraw transaction confirmed!");
    
    // Check final balance
    const vaultFinalBalance = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
    console.log("\n💰 Vault balance after:", hre.ethers.formatEther(vaultFinalBalance), "BNB");
    console.log("📈 Recovered:", hre.ethers.formatEther(vaultFinalBalance - vaultInitialBalance), "BNB");
    
  } catch (error) {
    console.error("\n❌ Error withdrawing from protocol:", error.message);
    console.log("\n💡 The protocol may not have a withdraw function, or it may require");
    console.log("   the vault owner/agent to call it instead of directly.");
    
    // Try alternative: check if protocol has any BNB
    const protocolBalance = await hre.ethers.provider.getBalance(PROTOCOL_ADDRESS);
    console.log("\n🔍 Protocol BNB balance:", hre.ethers.formatEther(protocolBalance), "BNB");
    
    if (protocolBalance > 0n) {
      console.log("   The protocol has BNB that could be recovered.");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
