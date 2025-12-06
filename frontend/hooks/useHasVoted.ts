import { useReadContract } from "thirdweb/react";
import { getBenefitsPoolContract } from "@/lib/contracts";

/**
 * Hook to check if an address has voted on a withdrawal request
 * @param requestId - The ID of the withdrawal request
 * @param address - The voter's address
 */
export function useHasVoted(requestId?: number, address?: string) {
  const contract = getBenefitsPoolContract();

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function hasVoted(uint256 _requestId, address _voter) view returns (bool)",
    params: requestId !== undefined && address ? [BigInt(requestId), address] : undefined,
  });

  return {
    hasVoted: data as boolean | undefined,
    isLoading,
    error,
    refetch,
  };
}
