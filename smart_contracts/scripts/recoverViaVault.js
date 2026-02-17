const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  const PROTOCOL_ADDRESS = "0xc6dFd5ad02d877582A4c81840Ab4E944c608021a";
  
  console.log("🔧 Attempting to recover funds via vault...");
  console.log("Vault:", VAULT_ADDRESS);
  console.log("Protocol:", PROTOCOL_ADDRESS);
  console.log("");

  const [signer] = await hre.ethers.getSigners();
  console.log("Using signer:", signer.address);
  
  // Get vault contract
  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  
  // Check if signer is the agent
  const agent = await vault.zenythAgent();
  const owner = await vault.owner();
  console.log("\n👤 Vault agent:", agent);
  console.log("👑 Vault owner:", owner);
  console.log("🔑 Your address:", signer.address);
  
  const isAgent = signer.address.toLowerCase() === agent.toLowerCase();
  const isOwner = signer.address.toLowerCase() === owner.toLowerCase();
  
  console.log("\n" + (isAgent ? "✅ You are the agent" : "❌ You are NOT the agent"));
  console.log(isOwner ? "✅ You are the owner" : "❌ You are NOT the owner");
  
  // Check balances
  const vaultBalance = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
  const protocolBalance = await hre.ethers.provider.getBalance(PROTOCOL_ADDRESS);
  
  console.log("\n💰 Vault balance:", hre.ethers.formatEther(vaultBalance), "BNB");
  console.log("💰 Protocol balance:", hre.ethers.formatEther(protocolBalance), "BNB");
  
  if (!isAgent && !isOwner) {
    console.log("\n❌ You don't have permission to recover funds.");
    console.log("   Only the vault agent or owner can do this.");
    return;
  }
  
  // Try to interact with the protocol through the vault
  // The vault has executeVibeRebalance which can call protocols
  // But we need a way to withdraw FROM the protocol
  
  console.log("\n🔍 Checking protocol interface...");
  
  // Try to call the protocol directly as agent
  try {
    // Create a generic contract interface
    const protocol = new hre.ethers.Contract(
      PROTOCOL_ADDRESS,
      [
        "function withdraw(uint256 amount) external returns (uint256)",
        "function withdrawAll() external",
        "function getBalance() external view returns (uint256)",
        "function supply(uint256 amount) external returns (uint256)"
      ],
      signer
    );
    
    // Try withdrawAll first
    console.log("\n📤 Trying protocol.withdrawAll()...");
    const tx = await protocol.withdrawAll();
    await tx.wait();
    console.log("✅ Success! Funds withdrawn from protocol");
    
  } catch (e1) {
    console.log("   withdrawAll failed:", e1.message.slice(0, 100));
    
    try {
      // Try withdraw with amount
      const protocol = new hre.ethers.Contract(
        PROTOCOL_ADDRESS,
        ["function withdraw(uint256 amount) external returns (uint256)"],
        signer
      );
      
      console.log("\n📤 Trying protocol.withdraw() with protocol balance...");
      const tx = await protocol.withdraw(protocolBalance);
      await tx.wait();
      console.log("✅ Success! Funds withdrawn from protocol");
      
    } catch (e2) {
      console.log("   withdraw(amount) failed:", e2.message.slice(0, 100));
      
      // Last resort: try to send raw call
      console.log("\n🔧 Trying raw call to protocol...");
      try {
        const tx = await signer.sendTransaction({
          to: PROTOCOL_ADDRESS,
          data: "0x3ccfd60b", // withdrawAll() selector
          gasLimit: 100000
        });
        await tx.wait();
        console.log("✅ Raw call succeeded!");
      } catch (e3) {
        console.log("   Raw call failed:", e3.message.slice(0, 100));
      }
    }
  }
  
  // Check final balances
  const vaultFinal = await hre.ethers.provider.getBalance(VAULT_ADDRESS);
  const protocolFinal = await hre.ethers.provider.getBalance(PROTOCOL_ADDRESS);
  
  console.log("\n📊 Final balances:");
  console.log("   Vault:", hre.ethers.formatEther(vaultFinal), "BNB");
  console.log("   Protocol:", hre.ethers.formatEther(protocolFinal), "BNB");
  
  if (vaultFinal > vaultBalance) {
    console.log("\n🎉 SUCCESS! Funds recovered to vault!");
    console.log("   You can now withdraw from the frontend.");
  } else {
    console.log("\n⚠️  Funds still in protocol.");
    console.log("   The protocol may require a different approach.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
