import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import '@openzeppelin/hardhat-upgrades'; // Must be added for HRE, otherwise it does not work!
import 'solidity-coverage';
import 'hardhat-gas-reporter'; // There is a conflict with hardhat-toolbox, so an older (1.0.8) version must be installed!
import '@typechain/hardhat';
import * as dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL || '';
const CONTRACT_DEPLOYER_PRIVATE_KEY = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY || '';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true" // activating with REPORT_GAS=true
  },  
  networks: {
    sepolia: {
      url: RPC_URL,
      accounts: CONTRACT_DEPLOYER_PRIVATE_KEY ? [CONTRACT_DEPLOYER_PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 1337, // Default Hardhat network
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10,
        // Each account is funded with 10,000 ETH
        accountsBalance: "10000000000000000000000"
      }
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

// When running solidity-coverage, force the default network to "coverage"
if (process.env.COVERAGE) {
  config.defaultNetwork = 'coverage';
}

export default config;
