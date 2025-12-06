// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockcUSD
 * @dev Mock cUSD token for testing purposes only
 * @notice This is for TESTING ONLY - not for production deployment
 */
contract MockcUSD is ERC20 {
    constructor() ERC20("Mock Celo Dollar", "cUSD") {
        // Constructor can remain empty - tokens will be minted as needed in tests
    }

    /**
     * @dev Mint new tokens (for testing)
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @dev Returns 18 decimals to match real cUSD
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
