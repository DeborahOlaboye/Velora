// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

contract VerifyScript is Script {
    function run() external view {
        address contractAddress = 0xaFAaD60c317Ef5329001eE1Eb47449Bf60DeE0CD;
        
        console.log("Contract to verify:", contractAddress);
        console.log("Network: Celo Mainnet");
        console.log("");
        console.log("Run the following command to verify:");
        console.log("");
        console.log("forge verify-contract \\");
        console.log("  0xaFAaD60c317Ef5329001eE1Eb47449Bf60DeE0CD \\");
        console.log("  src/BenefitsPool.sol:BenefitsPool \\");
        console.log("  --chain celo \\");
        console.log("  --etherscan-api-key $ETHERSCAN_API_KEY \\");
        console.log("  --watch");
    }
}
