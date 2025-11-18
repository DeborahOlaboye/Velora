// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BenefitsPool} from "../src/BenefitsPool.sol";
import {MockcUSD} from "../src/MockcUSD.sol";

contract DeployBenefitsPool is Script {
    // Celo Sepolia Testnet cUSD address (with checksum)
    address constant CUSD_SEPOLIA = 0x00BFD44e79FB7f6dd5887A9426c8EF85A0CD23e0; // cUSD on Celo Sepolia
    // Celo Mainnet cUSD address
    address constant CUSD_MAINNET = 0x765DE816845861e75A25fCA122bb6898B8B1282a;

    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // For Sepolia testnet
        address cUSDAddress = CUSD_SEPOLIA;
        console.log("Deploying to Celo Sepolia Testnet");

        console.log("Using cUSD address:", cUSDAddress);
        console.log("Deployer:", vm.addr(deployerPrivateKey));

        vm.startBroadcast(deployerPrivateKey);

        // Deploy BenefitsPool with cUSD token address
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
