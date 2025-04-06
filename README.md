# Tony's Sepolia Faucet

Tony's Sepolia Faucet - An open source Sepolia faucet with a daily free dripping.

![CI](https://github.com/tonynagyeurope/tonys-sepolia-faucet/actions/workflows/setup.yml/badge.svg)
![Formatting](https://github.com/tonynagyeurope/tonys-sepolia-faucet/actions/workflows/format.yml/badge.svg)
![Etherscan Verified](https://img.shields.io/badge/etherscan-verified-blue)
![Hardhat](https://img.shields.io/badge/built%20with-hardhat-yellow)
![Gas Report](https://img.shields.io/badge/gas%20report-CI%20generated-blue)
![License](https://img.shields.io/github/license/tonynagyeurope/tonys-sepolia-faucet)

## Project Description:

This faucet distributes 0.001 ETH per request, with a 24-hour cooldown and a 0.01 ETH cap per address. Deployed on the Sepolia testnet.

## Features:

Distributes 0.001 ETH per request.
24-hour cooldown between withdrawals.
0.01 ETH total cap per address.
Emergency pause/unpause functionality.
Reentrancy protection.

## Source of Sepolia ETH:

I use my own hardware to mine Sepolia ETH from the faucet for giveaways.

## Deployment Instructions:

1. Clone the repository: `git clone https://github.com/tonynagyeurope/tonys-sepolia-faucet.git`
2. Install dependencies: `npm install`
3. Configure your Sepolia network in `hardhat.config.ts`.
4. Deploy: `npx hardhat run scripts/deploy.ts --network sepolia`
5. Complex test with gas report: `REPORT_GAS=true npx hardhat test`

## Live Demo:

[www.tonynagy.io/projects/tonys-sepolia-faucet](https://www.tonynagy.io/projects/tonys-sepolia-faucet)

## Etherscan link to live contract: 

https://sepolia.etherscan.io/address/0xBE22b0E7d9243c7DE183FEfC3Ad4d8273B0451E8

## My RCP Alchemy endpoint:

https://eth-sepolia.g.alchemy.com/v2/gb-4LtVG_zt7ICDqp7AuPOuYdXGjRwtw

## Complex test with gas report screen:

![hardhat-test-with-gas-report](https://github.com/user-attachments/assets/ece99a67-3ec4-4a18-9632-9457d4f2d35e)

## Gas Usage

This project uses [hardhat-gas-reporter](https://github.com/cgewecke/hardhat-gas-reporter)  
to track function-level gas consumption. You can run:

```bash
REPORT_GAS=true npx hardhat test
```

## Security Features

```markdown
- `nonReentrant` protection to prevent reentrancy attacks
- `Ownable` pattern for admin control
- `pause/unpause` emergency stop via circuit breaker
- Input validation on request function
```

## Tech Stack

```markdown
- Solidity (v0.8.x)
- Hardhat + TypeScript
- Ethers.js
- GitHub Actions CI
- Alchemy RPC + Sepolia testnet
```

## License

MIT – feel free to use, extend or fork this faucet in your own Web3 projects.

## Contact

For further information or any questions, please contact:
````
    Developer: Tony Nagy
    Email: info@tonynagy.io
    Website: www.tonynagy.io
````
