import { prepareContractCall } from "thirdweb";
import { getCUSDContract } from "./contracts";
import { BENEFITS_POOL_ADDRESS } from "./thirdweb-client";

/**
 * Format token amount from wei to human-readable format
 * @param amount - Amount in wei (bigint)
 * @param decimals - Token decimals (default 18 for cUSD)
 */
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;

  // Convert remainder to decimal string with proper padding
  const decimalStr = remainder.toString().padStart(decimals, '0');
  const trimmedDecimal = decimalStr.slice(0, 2); // Show 2 decimal places

  return `${whole}.${trimmedDecimal}`;
}

/**
 * Parse token amount from human-readable format to wei
 * @param amount - Amount as string (e.g., "10.5")
 * @param decimals - Token decimals (default 18 for cUSD)
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const [whole = "0", decimal = "0"] = amount.split(".");
  const paddedDecimal = decimal.padEnd(decimals, "0");
  return BigInt(whole + paddedDecimal);
}

/**
 * Prepare approve transaction for cUSD token
 * @param amount - Amount to approve in wei
 */
export function prepareApproveTransaction(amount: bigint) {
  const contract = getCUSDContract();

  return prepareContractCall({
    contract,
    method: "function approve(address spender, uint256 amount) returns (bool)",
    params: [BENEFITS_POOL_ADDRESS, amount],
  });
}

/**
 * Prepare max approval transaction for cUSD token
 * This approves the maximum possible amount (2^256 - 1)
 */
export function prepareMaxApproveTransaction() {
  const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  return prepareApproveTransaction(MAX_UINT256);
}

/**
 * Check if approval is needed
 * @param requiredAmount - Amount needed for transaction
 * @param currentAllowance - Current allowance
 */
export function needsApproval(requiredAmount: bigint, currentAllowance?: bigint): boolean {
  if (!currentAllowance) return true;
  return currentAllowance < requiredAmount;
}
