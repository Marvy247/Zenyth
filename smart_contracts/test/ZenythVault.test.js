const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZenythVault", function () {
  let vault, owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const ZenythVault = await ethers.getContractFactory("ZenythVault");
    vault = await ZenythVault.deploy();
    await vault.waitForDeployment();
  });

  it("Should deploy with correct initial state", async function () {
    expect(await vault.totalDeposits()).to.equal(0);
    expect(await vault.totalShares()).to.equal(0);
  });

  it("Should allow deposits", async function () {
    const depositAmount = ethers.parseEther("1.0");
    await vault.connect(user1).deposit({ value: depositAmount });
    
    expect(await vault.totalDeposits()).to.equal(depositAmount);
    expect(await vault.userShares(user1.address)).to.be.gt(0);
  });

  it("Should allow withdrawals", async function () {
    const depositAmount = ethers.parseEther("1.0");
    await vault.connect(user1).deposit({ value: depositAmount });
    
    const shares = await vault.userShares(user1.address);
    await vault.connect(user1).withdraw(shares);
    
    expect(await vault.userShares(user1.address)).to.equal(0);
  });

  it("Should execute vibe rebalance by agent", async function () {
    await vault.connect(owner).deposit({ value: ethers.parseEther("2.0") });
    
    const mockProtocol = user1.address;
    await vault.approveProtocol(mockProtocol, true);
    
    await vault.executeVibeRebalance(
      85,
      mockProtocol,
      ethers.parseEther("1.0")
    );
    
    expect(await vault.getRebalanceCount()).to.equal(1);
  });
});
