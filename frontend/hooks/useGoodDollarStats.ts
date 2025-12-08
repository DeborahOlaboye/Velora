import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";

interface GoodDollarStats {
  totalClaimed: string;
  claimCount: number;
  lastClaimDate: Date | null;
  claimStreak: number;
  canClaimToday: boolean;
  nextClaimTime: Date | null;
  equivalentCUSD: string;
}

/**
 * Hook to fetch GoodDollar claim statistics for the connected user
 */
export function useGoodDollarStats() {
  const account = useActiveAccount();
  const [stats, setStats] = useState<GoodDollarStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!account?.address) {
        setStats(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/gooddollar/stats?address=${account.address}`);

        if (!response.ok) {
          throw new Error("Failed to fetch GoodDollar stats");
        }

        const data = await response.json();

        setStats({
          totalClaimed: data.totalClaimed || "0",
          claimCount: data.claimCount || 0,
          lastClaimDate: data.lastClaimDate ? new Date(data.lastClaimDate) : null,
          claimStreak: data.claimStreak || 0,
          canClaimToday: data.canClaimToday || false,
          nextClaimTime: data.nextClaimTime ? new Date(data.nextClaimTime) : null,
          equivalentCUSD: data.equivalentCUSD || "0",
        });
      } catch (err) {
        console.error("Error fetching GoodDollar stats:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // Set default empty stats on error
        setStats({
          totalClaimed: "0",
          claimCount: 0,
          lastClaimDate: null,
          claimStreak: 0,
          canClaimToday: true,
          nextClaimTime: null,
          equivalentCUSD: "0",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [account?.address]);

  const refetch = async () => {
    if (!account?.address) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/gooddollar/stats?address=${account.address}`);
      const data = await response.json();

      setStats({
        totalClaimed: data.totalClaimed || "0",
        claimCount: data.claimCount || 0,
        lastClaimDate: data.lastClaimDate ? new Date(data.lastClaimDate) : null,
        claimStreak: data.claimStreak || 0,
        canClaimToday: data.canClaimToday || false,
        nextClaimTime: data.nextClaimTime ? new Date(data.nextClaimTime) : null,
        equivalentCUSD: data.equivalentCUSD || "0",
      });
    } catch (err) {
      console.error("Error refetching GoodDollar stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}
