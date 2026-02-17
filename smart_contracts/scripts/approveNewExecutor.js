const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  const EXECUTOR_ADDRESS = "0xc6dFd5ad02d877582A4c81840Ab4E944c608021a";

  console.log("🔐 Approving ZenythExecutor in vault...");
  console.log("Vault:", VAULT_ADDRESS);
  console.log("Executor:", EXECUTOR_ADDRESS);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  
  const tx = await vault.approveProtocol(EXECUTOR_ADDRESS, true);
  await tx.wait();
  
  console.log("✅ ZenythExecutor approved!");
  
  // Also set it as the agent
  const tx2 = await vault.setZenythAgent(EXECUTOR_ADDRESS);
  await tx2.wait();
  
  console.log("✅ ZenythExecutor set as agent!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
