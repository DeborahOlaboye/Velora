/**
 * Script to update the minimum contribution in the BenefitsPool contract
 *
 * Usage:
 * 1. Connect your admin wallet (the one that deployed the contract)
 * 2. Run: npx tsx scripts/update-minimum-contribution.ts
 */

import { prepareContractCall } from "thirdweb";
import { getBenefitsPoolContract } from "@/lib/contracts";
import { parseUnits } from "ethers";

async function updateMinimumContribution() {
  const contract = getBenefitsPoolContract();

  // Set new minimum to 0.01 cUSD (1 cent) - or change to 0 for no minimum
  const newMinimum = parseUnits("0.01", 18); // 0.01 cUSD in wei
  // const newMinimum = 0n; // Uncomment this for NO minimum

  console.log("Preparing to update minimum contribution...");
  console.log("Contract:", contract.address);
  console.log("New minimum:", newMinimum.toString(), "wei (0.01 cUSD)");

  try {
    const transaction = prepareContractCall({
      contract,
      method: "function setMinimumContribution(uint256 _newMinimum)",
      params: [newMinimum],
    });

    console.log("\nTransaction prepared!");
    console.log("Please execute this transaction from your admin wallet.");
    console.log("You can use the dashboard or Thirdweb interface to sign and send it.");

    return transaction;
  } catch (error) {
    console.error("Error preparing transaction:", error);
    throw error;
  }
}

// Export for use in other scripts or components
export { updateMinimumContribution };

// Run if called directly
if (require.main === module) {
  updateMinimumContribution()
    .then(() => {
      console.log("\nSuccess! Transaction prepared.");
      console.log("Make sure to execute it with the contract owner wallet.");
    })
    .catch((error) => {
      console.error("\nFailed:", error.message);
      process.exit(1);
    });
}
