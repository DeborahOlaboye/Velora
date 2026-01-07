import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import {
  parseInviteCode,
  calculateValidUntilBlock,
  generateClaimSignature,
  trackEngagementReward,
  getInviteStats,
} from "@/lib/engagement-rewards";
import { ethers } from "ethers";

export interface EngagementRewardsState {
  inviterAddress: string | null;
  validUntilBlock: bigint | null;
  signature: string | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalInvites: number;
    successfulInvites: number;
    pendingInvites: number;
    totalRewardsEarned: string;
  } | null;
}

/**
 * Hook to manage engagement rewards for registration
 * Handles invite code parsing, signature generation, and reward claiming
 */
export function useEngagementRewards() {
  const account = useActiveAccount();
  const [state, setState] = useState<EngagementRewardsState>({
    inviterAddress: null,
    validUntilBlock: null,
    signature: null,
    isLoading: false,
    error: null,
    stats: null,
  });

  // Parse invite code from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteParam = urlParams.get("invite") || urlParams.get("ref");

    if (inviteParam && ethers.isAddress(inviteParam)) {
      setState((prev) => ({
        ...prev,
        inviterAddress: inviteParam,
      }));

      // Store in sessionStorage for persistence across page reloads
      sessionStorage.setItem("velora_invite_code", inviteParam);
    } else {
      // Check if we have a stored invite code
      const storedInvite = sessionStorage.getItem("velora_invite_code");
      if (storedInvite && ethers.isAddress(storedInvite)) {
        setState((prev) => ({
          ...prev,
          inviterAddress: storedInvite,
        }));
      }
    }
  }, []);

  // Fetch invite stats when account is connected
  useEffect(() => {
    if (account?.address) {
      fetchInviteStats();
    }
  }, [account?.address]);

  const fetchInviteStats = async () => {
    if (!account?.address) return;

    try {
      const stats = await getInviteStats(account.address);
      setState((prev) => ({ ...prev, stats }));
    } catch (error) {
      console.error("Error fetching invite stats:", error);
    }
  };

  /**
   * Prepare engagement rewards data for registration
   * Generates signature and validUntilBlock
   */
  const prepareRewardsData = async (
    appAddress: string
  ): Promise<{
    inviterAddress: string;
    validUntilBlock: bigint;
    signature: string;
  } | null> => {
    if (!account) {
      setState((prev) => ({
        ...prev,
        error: "No wallet connected",
      }));
      return null;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Calculate valid until block
      const validUntilBlock = await calculateValidUntilBlock();

      // Get inviter address (or zero address if none)
      const inviterAddress = state.inviterAddress || ethers.ZeroAddress;

      // Generate signature
      // Note: In production, you'd get a signer from the user's wallet
      // For now, we'll use a placeholder - the actual signing should happen client-side
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const signature = await generateClaimSignature(
        account.address,
        appAddress,
        inviterAddress,
        validUntilBlock,
        signer
      );

      setState((prev) => ({
        ...prev,
        validUntilBlock,
        signature,
        isLoading: false,
      }));

      return {
        inviterAddress,
        validUntilBlock,
        signature,
      };
    } catch (error) {
      console.error("Error preparing rewards data:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to prepare rewards",
        isLoading: false,
      }));
      return null;
    }
  };

  /**
   * Track a reward claim in the database
   */
  const trackRewardClaim = async (txHash: string, success: boolean) => {
    if (!account?.address) return;

    try {
      await trackEngagementReward(
        account.address,
        state.inviterAddress,
        txHash,
        success
      );

      // Refresh stats after tracking
      await fetchInviteStats();

      // Clear stored invite code after successful claim
      if (success) {
        sessionStorage.removeItem("velora_invite_code");
      }
    } catch (error) {
      console.error("Error tracking reward claim:", error);
    }
  };

  /**
   * Clear invite code (useful for testing or if user wants to register without referral)
   */
  const clearInviteCode = () => {
    sessionStorage.removeItem("velora_invite_code");
    setState((prev) => ({
      ...prev,
      inviterAddress: null,
      signature: null,
      validUntilBlock: null,
    }));
  };

  /**
   * Set invite code manually
   */
  const setInviteCode = (address: string) => {
    if (ethers.isAddress(address)) {
      sessionStorage.setItem("velora_invite_code", address);
      setState((prev) => ({
        ...prev,
        inviterAddress: address,
      }));
    }
  };

  return {
    ...state,
    prepareRewardsData,
    trackRewardClaim,
    clearInviteCode,
    setInviteCode,
    refreshStats: fetchInviteStats,
    hasInviteCode: !!state.inviterAddress,
  };
}
