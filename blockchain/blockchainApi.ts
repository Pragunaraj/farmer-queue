import http from "http";
import hre from "hardhat";

const PORT = 3001;

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const RPC_URL = "http://127.0.0.1:8545";


/* ================================
   RECORD PROCUREMENT
================================ */

async function recordProcurement(data: any) {

  const { ethers } = await hre.network.connect("localhost");

  const artifact =
    await hre.artifacts.readArtifact("FarmerProcurement");

  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const signer = await provider.getSigner(0);

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    artifact.abi,
    signer
  );

  const transaction =
    await contract.recordProcurement(
      data.farmerId,
      data.procurementId,
      data.crop,
      data.quantity,
      data.pricePerKg,
      data.centreId
    );

  await transaction.wait();

  return transaction.hash;
}


/* ================================
   GET PROCUREMENT FROM BLOCKCHAIN
================================ */

async function getProcurement(procurementId: string) {

  const { ethers } = await hre.network.connect("localhost");

  const artifact =
    await hre.artifacts.readArtifact("FarmerProcurement");

  const provider =
    new ethers.JsonRpcProvider(RPC_URL);

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    artifact.abi,
    provider
  );

  const procurement =
    await contract.getProcurement(procurementId);

  return {
    farmerId: procurement[0],
    procurementId: procurement[1],
    crop: procurement[2],
    quantity: procurement[3].toString(),
    pricePerKg: procurement[4].toString(),
    centreId: procurement[5],
    timestamp: procurement[6].toString()
  };
}


/* ================================
   HTTP SERVER
================================ */

const server = http.createServer(
  async (req, res) => {

    /* -------- RECORD PROCUREMENT -------- */

    if (
      req.method === "POST" &&
      req.url === "/record-procurement"
    ) {

      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {

        try {

          const data = JSON.parse(body);

          console.log(
            "Recording procurement:",
            data.procurementId
          );

          const transactionHash =
            await recordProcurement(data);

          res.writeHead(200, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message:
                "Procurement recorded on blockchain",
              transactionHash:
                transactionHash,
            })
          );

        } catch (error) {

          console.error(
            "Blockchain transaction failed:",
            error
          );

          res.writeHead(500, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              error:
                "Blockchain transaction failed",
            })
          );
        }
      });

      return;
    }


    /* -------- GET PROCUREMENT -------- */

    if (
      req.method === "GET" &&
      req.url?.startsWith("/procurement/")
    ) {

      try {

        const procurementId =
          decodeURIComponent(
            req.url.replace(
              "/procurement/",
              ""
            )
          );

        const procurement =
          await getProcurement(procurementId);

        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message:
              "Procurement retrieved from blockchain",
            procurement:
              procurement,
          })
        );

      } catch (error) {

        console.error(
          "Could not retrieve procurement:",
          error
        );

        res.writeHead(500, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            error:
              "Could not retrieve procurement",
          })
        );
      }

      return;
    }


    /* -------- UNKNOWN ROUTE -------- */

    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("Not Found");
  }
);


/* ================================
   START SERVER
================================ */

server.listen(PORT, () => {

  console.log(
    `Blockchain API running on http://127.0.0.1:${PORT}`
  );

});