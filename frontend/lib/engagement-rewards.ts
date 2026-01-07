import { ethers } from "ethers";
import { client, activeChain } from "./thirdweb-client";

/**
 * GoodDollar Engagement Rewards Integration
 *
 * Handles reward claiming for user registration and referrals
 */

// Contract addresses
export const ENGAGEMENT_REWARDS_ADDRESSES = {
  development: "0xb44fC3A592aDaA257AECe1Ae8956019EA53d0465", // Dev contract (anyone can approve)
  production: "0x25db74CF4E7BA120526fd87e159CF656d94bAE43", // Production contract
} as const;

// Get the appropriate contract address based on environment
export const getEngagementRewardsAddress = (): string => {
  const env = process.env.NEXT_PUBLIC_ENGAGEMENT_REWARDS_ENV || "development";
  return ENGAGEMENT_REWARDS_ADDRESSES[env as keyof typeof ENGAGEMENT_REWARDS_ADDRESSES];
};

// ABI for EngagementRewards contract (minimal interface)
export const ENGAGEMENT_REWARDS_ABI = [
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "inviter", type: "address" },
      { internalType: "uint256", name: "validUntilBlock", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "appClaim",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "inviter", type: "address" },
      { internalType: "uint256", name: "validUntilBlock", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
      { internalType: "uint8", name: "userAndInviterPercentage", type: "uint8" },
      { internalType: "uint8", name: "userPercentage", type: "uint8" },
    ],
    name: "appClaim",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Get current block number from the network
 */
export async function getCurrentBlockNumber(): Promise<bigint> {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo.org"
    );
    const blockNumber = await provider.getBlockNumber();
    return BigInt(blockNumber);
  } catch (error) {
    console.error("Error getting block number:", error);
    throw error;
  }
}

/**
 * Generate signature for engagement rewards claim
 * @param userAddress Address of the user claiming rewards
 * @param appAddress Address of the app contract
 * @param inviterAddress Address of the inviter (or zero address)
 * @param validUntilBlock Block number until which signature is valid
 * @param signer Ethers signer instance
 */
export async function generateClaimSignature(
  userAddress: string,
  appAddress: string,
  inviterAddress: string,
  validUntilBlock: bigint,
  signer: ethers.Signer
): Promise<string> {
  try {
    // Create the message to sign
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "address", "address", "uint256"],
      [userAddress, appAddress, inviterAddress, validUntilBlock]
    );

    // Sign the message
    const signature = await signer.signMessage(ethers.getBytes(messageHash));
    return signature;
  } catch (error) {
    console.error("Error generating signature:", error);
    throw error;
  }
}

/**
 * Check if user is registered with the app
 * @param appAddress Address of the app contract
 * @param userAddress Address of the user
 */
export async function isUserRegistered(
  appAddress: string,
  userAddress: string
): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo.org"
    );

    const engagementRewards = new ethers.Contract(
      getEngagementRewardsAddress(),
      ENGAGEMENT_REWARDS_ABI,
      provider
    );

    // Check if user has already registered (simplified check)
    // In production, you'd call a specific view function on the contract
    // For now, we'll track this in our database
    return false;
  } catch (error) {
    console.error("Error checking registration:", error);
    return false;
  }
}

/**
 * Calculate valid until block (current block + buffer)
 * @param blocksInFuture Number of blocks in the future (default: 600 ~ 10 minutes on Celo)
 */
export async function calculateValidUntilBlock(blocksInFuture: number = 600): Promise<bigint> {
  const currentBlock = await getCurrentBlockNumber();
  return currentBlock + BigInt(blocksInFuture);
}

/**
 * Parse invite code from URL
 * @param url URL containing invite code
 * @returns Inviter address or null
 */
export function parseInviteCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const inviteParam = urlObj.searchParams.get("invite");
    const refParam = urlObj.searchParams.get("ref");

    const inviteCode = inviteParam || refParam;

    if (inviteCode && ethers.isAddress(inviteCode)) {
      return inviteCode;
    }

    return null;
  } catch (error) {
    console.error("Error parsing invite code:", error);
    return null;
  }
}

/**
 * Generate invite link for a user
 * @param userAddress Address of the user sharing the invite
 * @param baseUrl Base URL of the app
 */
export function generateInviteLink(userAddress: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  return `${base}/register?invite=${userAddress}`;
}

/**
 * Estimate rewards for registration
 * Note: Actual rewards depend on contract configuration
 */
export function estimateRegistrationReward(): {
  userReward: string;
  inviterReward: string;
  currency: string;
} {
  // Default rewards (these should be fetched from contract in production)
  return {
    userReward: "10", // G$ tokens
    inviterReward: "5", // G$ tokens
    currency: "G$",
  };
}

/**
 * Format engagement rewards for display
 */
export function formatEngagementReward(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${num.toFixed(2)} G$`;
}

/**
 * Check if user is eligible for engagement rewards
 * Requires:
 * 1. User must be whitelisted in Identity contract (verified on GoodWallet/GoodDapp)
 * 2. User must not have claimed rewards in the last 180 days
 * 3. App must have reward quota available
 *
 * @param userAddress Address to check
 */
export async function checkEngagementEligibility(
  userAddress: string
): Promise<{
  eligible: boolean;
  reason?: string;
}> {
  try {
    // In production, you would check:
    // 1. Identity contract whitelist status
    // 2. Last claim timestamp
    // 3. App quota availability

    // For now, return a placeholder
    return {
      eligible: true,
    };
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return {
      eligible: false,
      reason: "Error checking eligibility",
    };
  }
}

/**
 * Track engagement rewards in database
 */
export async function trackEngagementReward(
  userAddress: string,
  inviterAddress: string | null,
  txHash: string,
  success: boolean
): Promise<void> {
  try {
    await fetch("/api/engagement/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAddress,
        inviterAddress,
        txHash,
        success,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Error tracking engagement reward:", error);
  }
}

/**
 * Get user's invite statistics
 */
export async function getInviteStats(userAddress: string): Promise<{
  totalInvites: number;
  successfulInvites: number;
  pendingInvites: number;
  totalRewardsEarned: string;
}> {
  try {
    const response = await fetch(`/api/engagement/stats?address=${userAddress}`);
    if (!response.ok) {
      throw new Error("Failed to fetch invite stats");
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting invite stats:", error);
    return {
      totalInvites: 0,
      successfulInvites: 0,
      pendingInvites: 0,
      totalRewardsEarned: "0",
    };
  }
}
