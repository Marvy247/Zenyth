const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Zenyth contracts to BNB Chain testnet...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)));

  const ZenythVault = await hre.ethers.getContractFactory("ZenythVault");
  const vault = await ZenythVault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ ZenythVault deployed:", vaultAddress);

  const ZenythExecutor = await hre.ethers.getContractFactory("ZenythExecutor");
  const executor = await ZenythExecutor.deploy(vaultAddress);
  await executor.waitForDeployment();
  const executorAddress = await executor.getAddress();
  console.log("✅ ZenythExecutor deployed:", executorAddress);

  console.log("\n📝 Update your .env file:");
  console.log(`ZENYTH_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`ZENYTH_EXECUTOR_ADDRESS=${executorAddress}`);
  
  console.log("\n🔗 Verify on explorer:");
  console.log(`https://testnet.bscscan.com/address/${vaultAddress}`);
  console.log(`https://testnet.bscscan.com/address/${executorAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
