import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();

  const contract = await ethers.deployContract("FarmerProcurement");

  await contract.waitForDeployment();

  console.log(
    "FarmerProcurement deployed to:",
    await contract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});