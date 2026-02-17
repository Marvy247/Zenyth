const hre = require("hardhat");

async function main() {
  const VAULT_ADDRESS = "0xe377Cb5aAB782315eF5bDa4ABA1be953a7156925";
  
  console.log("🔍 Checking vault agent settings...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer/Your address:", deployer.address);

  const vault = await hre.ethers.getContractAt("ZenythVault", VAULT_ADDRESS);
  
  // Check current agent
  const currentAgent = await vault.zenythAgent();
  console.log("Current zenythAgent:", currentAgent);
  
  // Check if deployer is owner
  const owner = await vault.owner();
  console.log("Contract owner:", owner);
  
  // For the hackathon demo, let's set the agent to the deployer address
  // so you can call executeVibeRebalance directly from the frontend
  if (currentAgent.toLowerCase() !== deployer.address.toLowerCase()) {
    console.log("📝 Setting zenythAgent to your address...");
    const tx = await vault.setZenythAgent(deployer.address);
    await tx.wait();
    console.log("✅ Agent updated!");
    
    const newAgent = await vault.zenythAgent();
    console.log("New zenythAgent:", newAgent);
  } else {
    console.log("✅ Agent already set correctly");
  }
  
  // Also check if executor is approved as protocol
  const EXECUTOR_ADDRESS = "0xc6dFd5ad02d877582A4c81840Ab4E944c608021a";
  const isApproved = await vault.approvedProtocols(EXECUTOR_ADDRESS);
  console.log("Executor approved as protocol:", isApproved);
  
  if (!isApproved) {
    console.log("📝 Approving executor as protocol...");
    const tx = await vault.approveProtocol(EXECUTOR_ADDRESS, true);
    await tx.wait();
    console.log("✅ Executor approved!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
