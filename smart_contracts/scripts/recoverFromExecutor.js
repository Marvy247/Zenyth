const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  const EXECUTOR_ADDRESS = "0xc6dFd5ad02d877582A4c81840Ab4E944c608021a";
  
  console.log("🔧 Recovering funds from ZenythExecutor...");
  console.log("Vault:", VAULT_ADDRESS);
  console.log("Executor:", EXECUTOR_ADDRESS);
  console.log("");

  const [signer] = await hre.ethers.getSigners();
  console.log("Using signer:", signer.address);
  
  // Get executor contract
  const executor = await hre.ethers.getContractAt("ZenythExecutor", EXECUTOR_ADDRESS);
  
  // Check ownership
  const owner = await executor.owner();
  console.log("\n👑 Executor owner:", owner);
  console.log("🔑 Your address:", signer.address);
  
  const isOwner = signer.address.toLowerCase() === owner.toLowerCase();
  console.log(isOwner ? "✅ You are the owner" : "❌ You are NOT the owner");
  
  if (!isOwner) {
    console.log("\n❌ Only the owner can recover funds");
    return;
  }
  
  // Check balances
  const executorBalance = await hre.ethers.provider.getBalance(EXECUTOR_ADDRESS);
  const vaultBalance = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
  
  console.log("\n💰 Executor balance:", hre.ethers.formatEther(executorBalance), "BNB");
  console.log("💰 Vault balance:", hre.ethers.formatEther(vaultBalance), "BNB");
  
  if (executorBalance === 0n) {
    console.log("\nℹ️  Executor has no BNB to recover");
    return;
  }
  
  // The executor doesn't have a withdraw function, so we need to use a workaround
  // Option 1: Use selfdestruct (extreme, destroys contract)
  // Option 2: Add a withdraw function via proxy (not possible with current setup)
  // Option 3: Register a "recovery" adapter that just returns funds
  
  console.log("\n🔧 Attempting recovery...");
  
  // Try to call registerAdapter with the vault as an adapter
  // Then executeStrategy to "supply" to the vault (which just sends BNB back)
  try {
    console.log("\n📋 Step 1: Register vault as a 'protocol adapter'...");
    
    // Register the vault itself as an adapter
    const registerTx = await executor.registerAdapter("recovery", VAULT_ADDRESS);
    await registerTx.wait();
    console.log("✅ Vault registered as adapter");
    
    // Now execute strategy with the vault as target
    // This will call vault.supply() which doesn't exist, but the call will send BNB
    console.log("\n📋 Step 2: Execute strategy to send BNB to vault...");
    
    // Actually, let's just send BNB directly using a simple transfer
    // Since we're the owner, we can do this
    
  } catch (e) {
    console.log("Registration failed:", e.message);
  }
  
  // Direct transfer approach - send BNB from executor to vault
  console.log("\n📤 Sending BNB from executor to vault...");
  
  try {
    // Create a transaction that sends all BNB from executor to vault
    // We need to call a function on the executor that does this
    
    // Since the executor is a contract we deployed and own, 
    // let's try to use any available function or just send directly
    
    // Check if executor has a receive/fallback
    const executorContract = new hre.ethers.Contract(
      EXECUTOR_ADDRESS,
      [
        "function owner() view returns (address)",
        "function zenythVault() view returns (address)",
        "function registerAdapter(string, address)",
        "function executeStrategy(string, uint256) returns (uint256)"
      ],
      signer
    );
    
    // Try to execute a strategy that sends BNB back
    // First, let's see if we can just transfer
    const tx = await signer.sendTransaction({
      to: EXECUTOR_ADDRESS,
      value: 0,
      data: "0x", // empty call
    });
    await tx.wait();
    
  } catch (e) {
    console.log("Direct approach failed:", e.message);
  }
  
  // Final check
  const finalExecutorBalance = await hre.ethers.provider.getBalance(EXECUTOR_ADDRESS);
  const finalVaultBalance = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
  
  console.log("\n📊 Final balances:");
  console.log("   Executor:", hre.ethers.formatEther(finalExecutorBalance), "BNB");
  console.log("   Vault:", hre.ethers.formatEther(finalVaultBalance), "BNB");
  
  if (finalVaultBalance > vaultBalance) {
    console.log("\n🎉 SUCCESS! Funds recovered!");
    console.log("   Recovered:", hre.ethers.formatEther(finalVaultBalance - vaultBalance), "BNB");
  } else {
    console.log("\n⚠️  Funds still in executor.");
    console.log("\n💡 Manual recovery needed:");
    console.log("   The ZenythExecutor contract needs a withdraw() function.");
    console.log("   Since it doesn't have one, you have two options:");
    console.log("   1. Redeploy the executor with a withdraw function");
    console.log("   2. Use a selfdestruct to send all funds to a target address");
    console.log("\n   For now, the vault has", hre.ethers.formatEther(vaultBalance), "BNB available");
    console.log("   You can withdraw this amount from the frontend.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
