import { useReadContract } from "thirdweb/react";
import { getBenefitsPoolContract } from "@/lib/contracts";

export interface WithdrawalRequest {
  worker: string;
  amount: bigint;
  reason: string;
  createdAt: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  executed: boolean;
  approved: boolean;
}

/**
 * Hook to fetch a specific withdrawal request from the smart contract
 * @param requestId - The ID of the withdrawal request
 */
export function useWithdrawalRequest(requestId?: number) {
  const contract = getBenefitsPoolContract();

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function getWithdrawalRequest(uint256 _requestId) view returns (address worker, uint256 amount, string reason, uint256 createdAt, uint256 votesFor, uint256 votesAgainst, bool executed, bool approved)",
    params: requestId !== undefined ? [BigInt(requestId)] : undefined,
  });

  if (!data || requestId === undefined) {
    return {
      request: null,
      isLoading,
      error,
      refetch,
    };
  }

  const request: WithdrawalRequest = {
    worker: data[0] as string,
    amount: data[1] as bigint,
    reason: data[2] as string,
    createdAt: data[3] as bigint,
    votesFor: data[4] as bigint,
    votesAgainst: data[5] as bigint,
    executed: data[6] as boolean,
    approved: data[7] as boolean,
  };

  return {
    request,
    isLoading,
    error,
    refetch,
  };
}
