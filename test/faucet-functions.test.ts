import { expect } from 'chai';
import { ethers } from "hardhat";
import { Wallet } from "ethers";
import * as dotenv from "dotenv";
import { TonysSepoliaFaucet } from '../typechain';

dotenv.config();

describe('TonysSepoliaFaucet contract deployment and function tests started.', async function () {
  let contract: TonysSepoliaFaucet;
  let contractAddress: string;

  // Retrieve the private key from the environment variable
  const deployerPrivateKey = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY;
  if (!deployerPrivateKey) {
      throw new Error("The CONTRACT_DEPLOYER_PRIVATE_KEY environment variable is not set!");
  }
  
  // Create a wallet instance and connect it to the current provider
  const provider = ethers.provider;
  const deployer = new Wallet(deployerPrivateKey, provider);  

  before(async function () {
    // Create the contract factory with the specified signer
    const tonysSepoliaFaucet = await ethers.getContractFactory("TonysSepoliaFaucet", deployer);
    console.log("Contract factory created using the specified deployer...");

    // Deploy the contract
    contract = await tonysSepoliaFaucet.deploy();
    await contract.waitForDeployment();
    contractAddress = contract.target;
    console.log("Test deployment successful, address: " + contractAddress);
  });

  // Test the valid contract address
  it('should return a valid contract address', async function () {
    expect(contractAddress).to.be.a('string');
    expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);
  });

  // Test the zero balance
  it('should test the zero balance of the fresh deployed contract with the getBalance() function', async function () {
    const result = await contract.getBalance();
    expect(result).equals(0); // The fresh deployed contract must have zero balance!
  });

  // Add a small deposit with the owner
  it('should test the deposit() method of the contract with a small amount (0.001 ETH) from the deployer and check the new balance', async function () {
    // Deposit 0.001 ETH
    const tx = await contract.deposit({ value: ethers.parseEther("0.001") });
    await tx.wait();
  
    // Retrieve the new balance from the contract
    const balance = await contract.getBalance();
  
    // Check that the balance is exactly 0.001 ETH (matches the deposit above)
    expect(balance).to.equal(ethers.parseEther("0.001"));
  });

  // Test the withdraw(address) and the getTotalWithdrawn(address) functions in one step
  it('should test the withdrawn and getTotalWithdrawn functions with the owner address', async function () {
    const tx = await contract.withdraw(deployer.address); // We withdrawn the default value: 0.001 ETH
    await tx.wait();

    const result: number = await contract.getTotalWithdrawn(deployer.address);
    console.log("Owner's total withdrawn funds: " + ethers.formatEther(result.toString()) + " ETH");
    expect(result).to.equal(ethers.parseEther("0.001")); // The fresh contract can have just the recently withdrawn amount
  });  

  // Test the pause() and unpause() functions with custom error handling for each case!
  it('should test the pause() and unpause() functions', async function () {
    const txPause = await contract.pause();
    await txPause.wait();

    try {
      const txWithdrawPaused = await contract.withdraw(deployer.address);
      await txWithdrawPaused.wait();
    } catch (error: any) {
      if (error.data) {
        // Decode the custom error
        const decodedError = contract.interface.parseError(error.data);
        if (decodedError) 
          expect(decodedError.name).equals("WithdrawalPaused"); 
        else 
          throw new error("Paused status should always raise a WithdrawalPaused custom error!");
      }       
    }

    const txUnpause = await contract.unpause();
    await txUnpause.wait();    

    try {
      const txWithdrawUnaused = await contract.withdraw(deployer.address); // We try to withdraw 0.001 ETH again
      await txWithdrawUnaused.wait();    
    } catch (error: any) {
      if (error.data) {
        // Decode the custom error
        const decodedError = contract.interface.parseError(error.data);
        if (decodedError) 
          // The contract should throw "LowBalance" custom error here because it is already unpaused but there was just 0.001 ETH deposit that we've alreary withdrawn!
          expect(decodedError.name).equals("LowBalance"); 
        else 
          throw new error("Unpaused status should raise a LowBalance custom error when we try the withdraw twice after just one deposit of 0.001 ETH!");
      }       
    }   

  });

});
