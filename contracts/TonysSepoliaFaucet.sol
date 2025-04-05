// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/**
 * @title Tony's Sepolia Faucet
 * @author Tony Nagy Solidity + AWS Developer
 * @notice A faucet contract for distributing small amounts of Sepolia ETH to users.
 * @dev Deployed on the Sepolia testnet. Inherits from OpenZeppelin's Ownable and ReentrancyGuard.
 */
contract TonysSepoliaFaucet is Ownable, ReentrancyGuard {
    /// @notice Amount of ETH distributed per withdrawal (0.001 ETH).
    uint256 public constant AMOUNT = 0.001 ether;

    /// @notice Maximum total ETH an address can withdraw (0.01 ETH).
    uint256 public constant CAP = 0.01 ether;

    /// @notice Cooldown period between withdrawals (24 hours).
    uint256 public constant COOLDOWN = 1 days;

    /// @notice Tracks whether withdrawals are paused.
    bool private paused;

    /// @notice Tracks the last withdrawal time for each address.
    mapping(address => uint256) private lastWithdrawalTime;

    /// @notice Tracks the total amount withdrawn by each address.
    mapping(address => uint256) private totalAmountWithdrawn;

    /// @notice Emitted when the owner deposits ETH into the contract.
    event Deposit(address indexed sender, uint256 value);

    /// @notice Emitted when a user withdraws ETH.
    event Withdrawal(address indexed recipient, uint256 amount);

    /// @notice Emitted when withdrawals are paused.
    event Paused();

    /// @notice Emitted when withdrawals are unpaused.
    event Unpaused();

    error LowBalance();
    error TransferFailed();
    error CooldownNotExpired();
    error LowDeposit();
    error TotalWithdrawalReached();
    error WithdrawalPaused();

    /// @notice Initializes the contract with the deployer as the owner.
    constructor() {
        paused = false;
    }

    /// @notice Allows the owner to deposit ETH into the contract to fund the faucet.
    /// @dev Reverts if the deposit amount is 0.
    function deposit() external payable onlyOwner {
        if (msg.value == 0) revert LowDeposit();
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice Returns the current ETH balance of the contract.
    /// @return The contract's ETH balance in wei.
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Returns the total amount withdrawn by a specific address.
    /// @param user The address to query.
    /// @return The total amount withdrawn by the user in wei.
    function getTotalWithdrawn(address user) external view returns (uint256) {
        return totalAmountWithdrawn[user];
    }

    /// @notice Pauses withdrawals. Only callable by the owner.
    function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }

    /// @notice Unpauses withdrawals. Only callable by the owner.
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }

    /// @notice Modifier to prevent withdrawals when the contract is paused.
    modifier whenNotPaused() {
        if (paused) revert WithdrawalPaused();
        _;
    }

    /// @notice Allows a user to withdraw 0.001 ETH, subject to cooldown, cap, and pause checks.
    /// @dev Reverts if the contract balance is too low, the cooldown hasn't expired, the cap is exceeded, or withdrawals are paused.
    function withdraw() external nonReentrant whenNotPaused {
        if (AMOUNT > address(this).balance) revert LowBalance();
        if (block.timestamp < lastWithdrawalTime[msg.sender] + COOLDOWN) revert CooldownNotExpired();
        if (totalAmountWithdrawn[msg.sender] + AMOUNT > CAP) revert TotalWithdrawalReached();

        totalAmountWithdrawn[msg.sender] += AMOUNT;
        lastWithdrawalTime[msg.sender] = block.timestamp;
        emit Withdrawal(msg.sender, AMOUNT);
        (bool success, ) = msg.sender.call{value: AMOUNT}("");
        if (!success) revert TransferFailed();
    }
}