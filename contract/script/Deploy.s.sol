// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BenefitsPool} from "../src/BenefitsPool.sol";

contract DeployBenefitsPool is Script {
    // Celo Sepolia Testnet cUSD address
    address constant CUSD_SEPOLIA = 0x00BFD44e79FB7f6dd5887A9426c8EF85A0CD23e0;
    // Celo Mainnet cUSD address (Mento Protocol)
    address constant CUSD_MAINNET = 0x765DE816845861e75A25fCA122bb6898B8B1282a;

    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Check if deploying to mainnet (set DEPLOY_MAINNET=true in .env)
        bool deployToMainnet = vm.envOr("DEPLOY_MAINNET", false);

        address cUSDAddress;
        if (deployToMainnet) {
            cUSDAddress = CUSD_MAINNET;
            console.log("=== DEPLOYING TO CELO MAINNET ===");
            console.log("WARNING: This will use real funds!");
        } else {
            cUSDAddress = CUSD_SEPOLIA;
            console.log("=== DEPLOYING TO CELO SEPOLIA TESTNET ===");
        }

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
