import { useReadContract } from "thirdweb/react";
import { getBenefitsPoolContract } from "@/lib/contracts";

export interface WorkerInfo {
  isRegistered: boolean;
  isVerified: boolean;
  totalContributions: bigint;
  lastContributionTime: bigint;
  joinedAt: bigint;
  lastWithdrawalTime: bigint;
  withdrawalCount: bigint;
  gigWorkType: string;
  location: string;
  yearsExperience: number;
  monthlyIncome: bigint;
}

/**
 * Hook to fetch worker information from the smart contract
 * @param address - Worker's wallet address
 */
export function useWorkerInfo(address?: string) {
  const contract = getBenefitsPoolContract();

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function getWorkerInfo(address _worker) view returns (bool isRegistered, bool isVerified, uint256 totalContributions, uint256 lastContributionTime, uint256 joinedAt, uint256 lastWithdrawalTime, uint256 withdrawalCount, string gigWorkType, string location, uint8 yearsExperience, uint256 monthlyIncome)",
    params: address ? [address] : ["0x0000000000000000000000000000000000000000"],
  });

  if (!data || !address) {
    return {
      workerInfo: null,
      isLoading,
      error,
      refetch,
    };
  }

  const workerInfo: WorkerInfo = {
    isRegistered: data[0] as boolean,
    isVerified: data[1] as boolean,
    totalContributions: data[2] as bigint,
    lastContributionTime: data[3] as bigint,
    joinedAt: data[4] as bigint,
    lastWithdrawalTime: data[5] as bigint,
    withdrawalCount: data[6] as bigint,
    gigWorkType: data[7] as string,
    location: data[8] as string,
    yearsExperience: Number(data[9]),
    monthlyIncome: data[10] as bigint,
  };

  return {
    workerInfo,
    isLoading,
    error,
    refetch,
  };
}
