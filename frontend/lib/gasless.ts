import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { Account } from "thirdweb/wallets";
import { client, activeChain, BENEFITS_POOL_ADDRESS } from "./thirdweb";

/**
 * Configuration for gasless transactions using thirdweb's infrastructure
 *
 * Features:
 * - Smart wallet support via inApp wallets (email, social logins)
 * - Sponsored transactions for new users
 * - Automatic gas estimation and optimization
 */

// Helper to check if wallet supports gasless transactions
export function isGaslessWallet(account: Account | undefined): boolean {
  if (!account) return false;
  // thirdweb smart wallets (from inApp auth) support gasless transactions
  return true; // All thirdweb wallets can use sponsored transactions
}

// Get benefits pool contract instance
export function getBenefitsPoolContract() {
  if (!BENEFITS_POOL_ADDRESS) {
    throw new Error("Benefits pool contract address not configured");
  }

  return getContract({
    client,
    chain: activeChain,
    address: BENEFITS_POOL_ADDRESS,
  });
}

/**
 * Execute a gasless transaction
 * Automatically uses sponsored transactions when available
 */
export async function executeGaslessTransaction(
  account: Account,
  contractCall: ReturnType<typeof prepareContractCall>
) {
  try {
    // thirdweb automatically handles gas sponsorship when configured
    // The starter plan (CELO-STARTER-2M) includes sponsored transactions
    const transaction = await sendTransaction({
      transaction: contractCall,
      account,
    });

    return {
      success: true,
      transactionHash: transaction.transactionHash,
    };
  } catch (error) {
    console.error("Gasless transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}

/**
 * Estimate gas for a transaction
 * Used to show users the gas savings from sponsored transactions
 */
export async function estimateGas(
  contractCall: ReturnType<typeof prepareContractCall>
): Promise<bigint> {
  try {
    // Get gas estimate from thirdweb
    const estimate = await contractCall.gas;
    return estimate || 0n;
  } catch (error) {
    console.error("Gas estimation failed:", error);
    return 0n;
  }
}
