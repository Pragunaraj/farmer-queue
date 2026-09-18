import hre from "hardhat";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function recordProcurement(
  farmerId: string,
  procurementId: string,
  crop: string,
  quantity: number,
  pricePerKg: number,
  centreId: string
) {
  const { ethers } = await hre.network.connect();

  const artifact = await hre.artifacts.readArtifact("FarmerProcurement");

  const [signer] = await ethers.getSigners();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    artifact.abi,
    signer
  );

  const transaction = await contract.recordProcurement(
    farmerId,
    procurementId,
    crop,
    quantity,
    pricePerKg,
    centreId
  );

  await transaction.wait();

  return transaction.hash;
}