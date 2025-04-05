import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import '@openzeppelin/hardhat-upgrades'; // Must be added for HRE!
import * as dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL || '';
const CONTRACT_DEPLOYER_PRIVATE_KEY = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY || '';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: RPC_URL || '',
      accounts: CONTRACT_DEPLOYER_PRIVATE_KEY ? [CONTRACT_DEPLOYER_PRIVATE_KEY] : []
    },
    hardhat: {
      chainId: 1337, // Default Hardhat network
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // The first deployer account
    },
  },
  defaultNetwork: 'sepolia',
};

export default config;