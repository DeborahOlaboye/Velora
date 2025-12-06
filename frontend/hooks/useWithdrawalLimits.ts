import { useReadContract } from "thirdweb/react";
import { getBenefitsPoolContract } from "@/lib/contracts";

export interface WithdrawalLimits {
  tier1Limit: bigint;
  tier2Limit: bigint;
  needsVerification: boolean;
}

/**
 * Hook to fetch withdrawal limits for a worker from the smart contract
 * @param address - Worker's wallet address
 */
export function useWithdrawalLimits(address?: string) {
  const contract = getBenefitsPoolContract();

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function getWithdrawalLimits(address _worker) view returns (uint256 tier1Limit, uint256 tier2Limit, bool needsVerification)",
    params: address ? [address] : ["0x0000000000000000000000000000000000000000"],
  });

  if (!data || !address) {
    return {
      limits: null,
      isLoading,
      error,
      refetch,
    };
  }

  const limits: WithdrawalLimits = {
    tier1Limit: data[0] as bigint,
    tier2Limit: data[1] as bigint,
    needsVerification: data[2] as boolean,
  };

  return {
    limits,
    isLoading,
    error,
    refetch,
  };
}
