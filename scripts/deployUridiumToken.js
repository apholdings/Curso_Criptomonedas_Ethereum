const { ethers } = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    },ms)
  })
}

async function main() { 
    const [deployer] = await ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
  
    // Deploy uridium contract with a max supply of 1005577
    const totalSupply = ethers.parseEther("1005577");
    const uridiumToken = await ethers.deployContract("UridiumToken", [totalSupply, "Uridium", "URI"]);
    await uridiumToken.waitForDeployment();
  
    const receipt = uridiumToken.deploymentTransaction();

    console.log(`Tx Receipt ${JSON.stringify(receipt, null, 2)}`);
    const tokenAddress = await uridiumToken.getAddress()
    console.log(`Contract address: ${tokenAddress}`);
  
      // Delay of 45 seconds
      await sleep(45 * 1000)
      await hre.run("verify:verify", {
        address: tokenAddress,
        constructorArguments: [totalSupply, "Uridium", "URI"],
      })
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
})