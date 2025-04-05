# Tony's Sepolia Faucet

Tony's Sepolia Faucet - An open source Sepolia faucet with a daily free dripping.

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

1. Clone the repository: `git clone https://github.com/yourusername/tonys-sepolia-faucet.git`
2. Install dependencies: `npm install`
3. Configure your Sepolia network in `hardhat.config.ts`.
4. Deploy: `npx hardhat run scripts/deploy.ts --network sepolia`

## Live Demo:

[www.tonynagy.io/projects/tonys-sepolia-faucet](https://www.tonynagy.io/projects/tonys-sepolia-faucet)