const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  const EXECUTOR_ADDRESS = "0xc6dFd5ad02d877582A4c81840Ab4E944c608021a";
  
  console.log("🔐 Approving executor as protocol...");
  console.log("Vault:", VAULT_ADDRESS);
  console.log("Executor:", EXECUTOR_ADDRESS);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Owner address:", deployer.address);

  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  
  // Check current approval status
  const isApproved = await vault.approvedProtocols(EXECUTOR_ADDRESS);
  console.log("Currently approved:", isApproved);
  
  if (!isApproved) {
    console.log("📝 Approving executor...");
    const tx = await vault.approveProtocol(EXECUTOR_ADDRESS, true);
    await tx.wait();
    console.log("✅ Executor approved as protocol!");
    
    // Verify
    const checkAgain = await vault.approvedProtocols(EXECUTOR_ADDRESS);
    console.log("Verification - approved:", checkAgain);
  } else {
    console.log("✅ Already approved");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
