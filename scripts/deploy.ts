import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const TonysSepoliaFaucet = await ethers.getContractFactory("TonysSepoliaFaucet");
  const faucet = await TonysSepoliaFaucet.deploy();
  await faucet.waitForDeployment();

  console.log("TonysSepoliaFaucet deployed to:", faucet.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});