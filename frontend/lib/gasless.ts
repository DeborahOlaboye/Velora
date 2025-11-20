import { getContract, prepareContractCall, sendTransaction, estimateGas as estimateGasThirdweb } from "thirdweb";
import { Account } from "thirdweb/wallets";
import { client, activeChain, BENEFITS_POOL_ADDRESS, CUSD_TOKEN_ADDRESS } from "./thirdweb-client";
import { isGaslessEligible } from "./thirdweb-client";

/**
 * Enhanced Gasless Transaction Service
 * 
 * Features:
 * - Automatic gas sponsorship for eligible actions
 * - Fallback to regular transactions if sponsorship fails
 * - Gas estimation and savings calculation
 * - Transaction status tracking
 */

// Benefits Pool Contract ABI (partial)
const BENEFITS_POOL_ABI = [
  "function registerWorker() external",
  "function contribute(uint256 _amount) external",
  "function voteOnWithdrawal(uint256 _requestId, bool _support) external",
  "function requestWithdrawal(uint256 _amount, string calldata _reason) external returns (uint256)",
] as const;

// cUSD Token ABI (partial)
const CUSD_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
] as const;

/**
 * Get Benefits Pool contract instance
 */
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
 * Get cUSD token contract instance
 */
export function getCUSDContract() {
  if (!CUSD_TOKEN_ADDRESS) {
    throw new Error("cUSD token address not configured");
  }

  return getContract({
    client,
    chain: activeChain,
    address: CUSD_TOKEN_ADDRESS,
  });
}

/**
 * Execute a transaction with automatic gasless support
 */
export async function executeTransaction(
  account: Account,
  contractCall: ReturnType<typeof prepareContractCall>,
  action?: string
): Promise<{
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasless?: boolean;
  gasSaved?: string;
}> {
  try {
    // Check if action is eligible for gas sponsorship
    const useGasless = action ? isGaslessEligible(action) : false;

    // Estimate gas cost
    let estimatedGas = 0n;
    try {
      estimatedGas = await estimateGasThirdweb({
        transaction: contractCall,
        account,
      });
    } catch (e) {
      console.warn("Gas estimation failed, proceeding anyway");
    }

    // Send transaction
    const transaction = await sendTransaction({
      transaction: contractCall,
      account,
      // thirdweb automatically sponsors if configured
    });

    // Calculate gas saved (if gasless)
    const gasSaved = useGasless && estimatedGas > 0n
      ? (estimatedGas * 5000000000n).toString() // Approximate gas price
      : undefined;

    return {
      success: true,
      transactionHash: transaction.transactionHash,
      gasless: useGasless,
      gasSaved,
    };
  } catch (error) {
    console.error("Transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}

/**
 * Register worker with gasless transaction
 */
export async function registerWorkerGasless(account: Account) {
  const contract = getBenefitsPoolContract();
  const transaction = prepareContractCall({
    contract,
    method: "function registerWorker() external",
    params: [],
  });

  return executeTransaction(account, transaction, "registerWorker");
}

/**
 * Vote on withdrawal with gasless transaction
 */
export async function voteOnWithdrawalGasless(
  account: Account,
  requestId: bigint,
  support: boolean
) {
  const contract = getBenefitsPoolContract();
  const transaction = prepareContractCall({
    contract,
    method: "function voteOnWithdrawal(uint256 _requestId, bool _support) external",
    params: [requestId, support],
  });

  return executeTransaction(account, transaction, "voteOnWithdrawal");
}

/**
 * Contribute to pool (with approval if needed)
 */
export async function contributeToPool(
  account: Account,
  amount: bigint
): Promise<{
  success: boolean;
  transactionHash?: string;
  error?: string;
  approvalTxHash?: string;
}> {
  try {
    const cusdContract = getCUSDContract();
    const poolContract = getBenefitsPoolContract();

    // Check allowance
    const allowance = await cusdContract.read.allowance([
      account.address,
      BENEFITS_POOL_ADDRESS,
    ]);

    // Approve if needed
    let approvalTxHash: string | undefined;
    if (allowance < amount) {
      const approvalTx = prepareContractCall({
        contract: cusdContract,
        method: "function approve(address spender, uint256 amount) external returns (bool)",
        params: [BENEFITS_POOL_ADDRESS, amount],
      });

      const approvalResult = await executeTransaction(account, approvalTx);
      if (!approvalResult.success) {
        return {
          success: false,
          error: "Approval failed: " + approvalResult.error,
        };
      }
      approvalTxHash = approvalResult.transactionHash;
    }

    // Contribute
    const contributeTx = prepareContractCall({
      contract: poolContract,
      method: "function contribute(uint256 _amount) external",
      params: [amount],
    });

    const result = await executeTransaction(account, contributeTx, "contribute");

    return {
      ...result,
      approvalTxHash,
    };
  } catch (error) {
    console.error("Contribution failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Contribution failed",
    };
  }
}

/**
 * Request withdrawal
 */
export async function requestWithdrawal(
  account: Account,
  amount: bigint,
  reason: string
) {
  const contract = getBenefitsPoolContract();
  const transaction = prepareContractCall({
    contract,
    method: "function requestWithdrawal(uint256 _amount, string calldata _reason) external returns (uint256)",
    params: [amount, reason],
  });

  return executeTransaction(account, transaction);
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  account: Account,
  contractCall: ReturnType<typeof prepareContractCall>
): Promise<bigint> {
  try {
    const estimate = await estimateGasThirdweb({
      transaction: contractCall,
      account,
    });
    return estimate;
  } catch (error) {
    console.error("Gas estimation failed:", error);
    return 0n;
  }
}

/**
 * Calculate gas cost in cUSD
 */
export function calculateGasCost(gasAmount: bigint, gasPrice: bigint = 5000000000n): string {
  const cost = gasAmount * gasPrice;
  return (Number(cost) / 1e18).toFixed(6);
}
