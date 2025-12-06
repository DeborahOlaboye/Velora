import { useReadContract } from "thirdweb/react";
import { getCUSDContract } from "@/lib/contracts";
import { BENEFITS_POOL_ADDRESS } from "@/lib/thirdweb-client";

/**
 * Hook to check cUSD allowance for the BenefitsPool contract
 * @param address - The wallet address to check allowance for
 */
export function useCUSDAllowance(address?: string) {
  const contract = getCUSDContract();

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function allowance(address owner, address spender) view returns (uint256)",
    params: address ? [address, BENEFITS_POOL_ADDRESS] : ["0x0000000000000000000000000000000000000000", BENEFITS_POOL_ADDRESS],
  });

  return {
    allowance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}
