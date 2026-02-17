const hre = require("hardhat");

async function main() {
  console.log("🔧 Approving protocol in ZenythVault...");

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner:", owner.address);

  // Contract addresses
  const VAULT_ADDRESS = "0xd8b4875b61130D651409d26C47D49f57BEbC1780";
  const EXECUTOR_ADDRESS = "0x391926D40EF9d7e94f5656c4d0A8698714ff20Af";

  // Get vault contract
  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  
  console.log("Current vault owner:", await vault.owner());
  
  // Approve ZenythExecutor as a protocol
  console.log(`Approving ${EXECUTOR_ADDRESS}...`);
  const tx = await vault.approveProtocol(EXECUTOR_ADDRESS, true);
  await tx.wait();
  
  console.log("✅ Protocol approved!");
  
  // Verify
  const isApproved = await vault.approvedProtocols(EXECUTOR_ADDRESS);
  console.log("Is approved:", isApproved);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
