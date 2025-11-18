// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BenefitsPool} from "../src/BenefitsPool.sol";
import {MockcUSD} from "../src/MockcUSD.sol";

contract DeployBenefitsPool is Script {
    // Celo Sepolia Testnet cUSD address
    address constant CUSD_SEPOLIA = 0x4822e58de6f5e485eF90df51C41CE01721331dC0;
    // Celo Alfajores cUSD address
    address constant CUSD_ALFAJORES = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    // Celo Mainnet cUSD address
    address constant CUSD_MAINNET = 0x765DE816845861e75A25fCA122bb6898B8B1282a;

    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Get the chain ID to determine which cUSD address to use
        uint256 chainId = block.chainid;
        address cUSDAddress;

        if (chainId == 44787) {
            // Alfajores Testnet
            cUSDAddress = CUSD_ALFAJORES;
            console.log("Deploying to Celo Alfajores Testnet");
        } else if (chainId == 1740) {
            // Sepolia Testnet
            cUSDAddress = CUSD_SEPOLIA;
            console.log("Deploying to Celo Sepolia Testnet");
        } else if (chainId == 42220) {
            // Celo Mainnet
            cUSDAddress = CUSD_MAINNET;
            console.log("Deploying to Celo Mainnet");
        } else {
            revert("Unsupported network");
        }

        console.log("Using cUSD address:", cUSDAddress);
        console.log("Deployer:", vm.addr(deployerPrivateKey));

        vm.startBroadcast(deployerPrivateKey);

        // Deploy BenefitsPool
        BenefitsPool pool = new BenefitsPool(cUSDAddress);

        console.log("BenefitsPool deployed to:", address(pool));
        console.log("Owner:", pool.owner());
        console.log("Minimum contribution:", pool.minimumContribution());
        console.log("Voting period (seconds):", pool.votingPeriod());
        console.log("Voting threshold:", pool.votingThreshold(), "%");

        vm.stopBroadcast();

        // Log deployment info
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Contract Address:", address(pool));
        console.log("Add this to your .env file:");
        console.log("NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS=", address(pool));
    }
}
