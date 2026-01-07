// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {BenefitsPoolV2} from "../src/BenefitsPoolV2.sol";

contract DeployV2 is Script {
    // cUSD addresses
    address constant CUSD_MAINNET = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    address constant CUSD_SEPOLIA = 0x00BFD44e79FB7f6dd5887A9426c8EF85A0CD23e0;

    // Engagement Rewards addresses
    address constant ENGAGEMENT_REWARDS_DEV = 0xb44fC3A592aDaA257AECe1Ae8956019EA53d0465;
    address constant ENGAGEMENT_REWARDS_PROD = 0x25db74CF4E7BA120526fd87e159CF656d94bAE43;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Determine which network we're on
        uint256 chainId = block.chainid;
        address cUSDAddress;
        address engagementRewardsAddress;

        if (chainId == 42220) {
            // Celo Mainnet
            cUSDAddress = CUSD_MAINNET;
            engagementRewardsAddress = ENGAGEMENT_REWARDS_PROD;
        } else if (chainId == 44787) {
            // Celo Alfajores (Testnet)
            cUSDAddress = CUSD_SEPOLIA;
            engagementRewardsAddress = ENGAGEMENT_REWARDS_DEV;
        } else {
            revert("Unsupported network");
        }

        vm.startBroadcast(deployerPrivateKey);

        BenefitsPoolV2 pool = new BenefitsPoolV2(
            cUSDAddress,
            engagementRewardsAddress
        );

        vm.stopBroadcast();

        // Log deployment info
        console.log("BenefitsPoolV2 deployed to:", address(pool));
        console.log("Chain ID:", chainId);
        console.log("cUSD address:", cUSDAddress);
        console.log("Engagement Rewards:", engagementRewardsAddress);
    }
}
