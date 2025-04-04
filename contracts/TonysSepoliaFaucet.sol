// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 * @title Tony's Sepolia Faucet
 * @author Tony Nagy Solidity + AWS Developer
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TonysSepoliaFaucet is Ownable, ReentrancyGuard {
    uint256 public constant AMOUNT = 0.001 ether;
    uint256 public constant COOLDOWN = 1 days;

    mapping(address => uint256) private lastWithdrawalTime;

    event Deposit(address indexed sender, uint256 value);
    event Withdrawal(address indexed recipient, uint256 amount);

    error LowDeposit();
    error LowBalance();
    error TransferFailed();
    error CooldownNotExpired();

    function deposit() external payable onlyOwner {
        if (msg.value == 0) revert LowDeposit();
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() external nonReentrant {
        if (AMOUNT > address(this).balance) revert LowBalance();
        if (block.timestamp < lastWithdrawalTime[msg.sender] + COOLDOWN) revert CooldownNotExpired();
        
        lastWithdrawalTime[msg.sender] = block.timestamp;
        emit Withdrawal(msg.sender, AMOUNT);
        (bool success, ) = msg.sender.call{value: AMOUNT}("");
        if (!success) revert TransferFailed();
    }
}