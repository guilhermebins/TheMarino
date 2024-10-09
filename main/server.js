require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Web3 = require("web3");

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contractABI = [
  /* ABI do seu smart contract */
];
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

app.use(cors());
app.use(express.json());

app.get("/api/token0price", async (req, res) => {
  const query = `
    {
      pool(id: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640") {
        id,
        volumeUSD,
        feeTier,
        token0Price,
        token1Price,
        token0 {
          symbol,
          id,
          decimals
        }
        token1 {
          symbol,
          id,
          decimals
        }
      }
    }
  `;

  try {
    const { data } = await axios.post(
      `https://gateway-arbitrum.network.thegraph.com/api/${API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`,
      { query }
    );

    const token1Symbol = data.data.pool.token1.symbol;
    const token0Price = data.data.pool.token0Price;

    res.json({ token1Symbol, token0Price });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/api/registerUser", async (req, res) => {
  try {
    const { userAddress } = req.body;
    const tx = contract.methods.registerUser();
    const gas = await tx.estimateGas({ from: userAddress });
    const data = tx.encodeABI();
    const txData = {
      from: userAddress,
      to: CONTRACT_ADDRESS,
      data,
      gas,
    };
    const receipt = await web3.eth.sendTransaction(txData);
    res.json(receipt);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/api/fundAccount", async (req, res) => {
  try {
    const { userAddress, amount } = req.body;
    const tx = contract.methods.fundAccount();
    const gas = await tx.estimateGas({ from: userAddress, value: amount });
    const data = tx.encodeABI();
    const txData = {
      from: userAddress,
      to: CONTRACT_ADDRESS,
      value: amount,
      data,
      gas,
    };
    const receipt = await web3.eth.sendTransaction(txData);
    res.json(receipt);
  } catch (error) {
    console.error("Error funding account:", error);
    res.status(500).json({ error: "Failed to fund account" });
  }
});

app.post("/api/receiveSignal", async (req, res) => {
  try {
    const { userAddress } = req.body;
    const tx = contract.methods.receiveSignal(userAddress);
    const gas = await tx.estimateGas({ from: account.address });
    const data = tx.encodeABI();
    const txData = {
      from: account.address,
      to: CONTRACT_ADDRESS,
      data,
      gas,
    };
    const receipt = await web3.eth.sendTransaction(txData);
    res.json(receipt);
  } catch (error) {
    console.error("Error receiving signal:", error);
    res.status(500).json({ error: "Failed to receive signal" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
