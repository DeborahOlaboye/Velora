import { useReadContract } from "thirdweb/react";
import { getBenefitsPoolContract } from "@/lib/contracts";

export interface PoolStats {
  balance: bigint;
  workersCount: bigint;
  activeRequests: bigint;
}

/**
 * Hook to fetch pool statistics from the smart contract
 */
export function usePoolStats() {
  const contract = getBenefitsPoolContract();

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function getPoolStats() view returns (uint256 balance, uint256 workers_count, uint256 activeRequests)",
    params: [],
  });

  if (!data) {
    return {
      poolStats: null,
      isLoading,
      error,
      refetch,
    };
  }

  const poolStats: PoolStats = {
    balance: data[0] as bigint,
    workersCount: data[1] as bigint,
    activeRequests: data[2] as bigint,
  };

  return {
    poolStats,
    isLoading,
    error,
    refetch,
  };
}
