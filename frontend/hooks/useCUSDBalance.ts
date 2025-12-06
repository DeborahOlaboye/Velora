import { useReadContract } from "thirdweb/react";
import { getCUSDContract } from "@/lib/contracts";

/**
 * Hook to fetch cUSD balance for an address
 * @param address - The wallet address to check balance for
 */
export function useCUSDBalance(address?: string) {
  const contract = getCUSDContract();

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: address ? [address] : ["0x0000000000000000000000000000000000000000"],
  });

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}
