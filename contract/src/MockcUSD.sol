// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockcUSD
 * @dev Mock cUSD token for testing purposes
 */
contract MockcUSD is ERC20 {
    constructor() ERC20("Celo Dollar", "cUSD") {
        // Mint initial supply for testing
        _mint(msg.sender, 1000000 * 10**18); // 1M cUSD
    }

    /**
     * @dev Mint tokens for testing
     * @param to Address to mint tokens to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @dev Decimals for cUSD (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
