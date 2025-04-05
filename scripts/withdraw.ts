// scripts/withdraw.ts
import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import { exit } from 'process';
dotenv.config();

const RPC_URL = process.env.RPC_URL || '';
if (!RPC_URL) {
  throw new Error('RPC_URL is not set in .env file!');
}

const DEPLOYED_SEPOLIA_ADDRESS = process.env.DEPLOYED_SEPOLIA_ADDRESS || '';
if (!DEPLOYED_SEPOLIA_ADDRESS) {
  throw new Error('DEPLOYED_SEPOLIA_ADDRESS is not set in .env file!');
}

const CONTRACT_DEPLOYER_PRIVATE_KEY = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY || '';
if (!CONTRACT_DEPLOYER_PRIVATE_KEY) {
  throw new Error('CONTRACT_DEPLOYER_PRIVATE_KEY is not set in .env file!');
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signerFaucet = new ethers.Wallet(CONTRACT_DEPLOYER_PRIVATE_KEY, provider);

  const contractABI = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    }    
  ];

  const contract = new ethers.Contract(
    DEPLOYED_SEPOLIA_ADDRESS,
    contractABI,
    signerFaucet
  );

  const tx = await contract.withdraw("0xe2734c8839515b1E4D2D36966fD8E1FB7100E849");

  tx.wait();
  console.log(`Successful withdraw to given wallet!`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exitCode = 1;
});
