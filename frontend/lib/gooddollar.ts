import { ethers } from "ethers";
import { prisma } from "./prisma";

/**
 * GoodDollar Integration Service
 * 
 * Handles UBI claiming and optional auto-contribution to the benefits pool
 */

// GoodDollar contract addresses
const GOODDOLLAR_ADDRESSES = {
  production: {
    celo: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A", // G$ on Celo Mainnet
    fuse: "0x495d133B938596C9984d462F007B676bDc57eCEC", // G$ on Fuse
  },
  development: {
    celo: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A", // Same for testnet
    fuse: "0x495d133B938596C9984d462F007B676bDc57eCEC",
  },
};

// GoodDollar UBI Scheme contract (for claiming)
const UBI_SCHEME_ADDRESSES = {
  production: {
    celo: "0xD7aC544F8A570C4d8764c3AAbCF6870CBD960D0D",
    fuse: "0xAACbaaB8571cbECEB46ba85B5981efDB8928545e",
  },
  development: {
    celo: "0xD7aC544F8A570C4d8764c3AAbCF6870CBD960D0D",
    fuse: "0xAACbaaB8571cbECEB46ba85B5981efDB8928545e",
  },
};

/**
 * Get GoodDollar contract address for current environment
 */
export function getGoodDollarAddress(network: "celo" | "fuse" = "celo"): string {
  const env = process.env.NEXT_PUBLIC_GOODDOLLAR_ENV || "development";
  return GOODDOLLAR_ADDRESSES[env as keyof typeof GOODDOLLAR_ADDRESSES][network];
}

/**
 * Get UBI Scheme contract address
 */
export function getUBISchemeAddress(network: "celo" | "fuse" = "celo"): string {
  const env = process.env.NEXT_PUBLIC_GOODDOLLAR_ENV || "development";
  return UBI_SCHEME_ADDRESSES[env as keyof typeof UBI_SCHEME_ADDRESSES][network];
}

/**
 * Check if user can claim GoodDollar
 */
export async function canClaimGoodDollar(
  walletAddress: string,
  network: "celo" | "fuse" = "celo"
): Promise<{
  canClaim: boolean;
  nextClaimTime?: Date;
  claimAmount?: string;
}> {
  try {
    const provider = new ethers.JsonRpcProvider(
      network === "celo"
        ? process.env.NEXT_PUBLIC_CELO_RPC_URL
        : "https://rpc.fuse.io"
    );

    const ubiSchemeAddress = getUBISchemeAddress(network);
    
    // UBI Scheme ABI (simplified)
    const ubiSchemeABI = [
      "function checkEntitlement(address _member) external view returns (uint256)",
      "function lastClaimed(address _member) external view returns (uint256)",
      "function claimDistribution() external view returns (uint256)",
    ];

    const ubiScheme = new ethers.Contract(
      ubiSchemeAddress,
      ubiSchemeABI,
      provider
    );

    // Check entitlement (amount user can claim)
    const entitlement = await ubiScheme.checkEntitlement(walletAddress);
    const lastClaimedTimestamp = await ubiScheme.lastClaimed(walletAddress);

    const canClaim = entitlement > 0n;
    const nextClaimTime = lastClaimedTimestamp > 0n
      ? new Date(Number(lastClaimedTimestamp) * 1000 + 24 * 60 * 60 * 1000) // 24 hours later
      : new Date();

    return {
      canClaim,
      nextClaimTime,
      claimAmount: ethers.formatEther(entitlement),
    };
  } catch (error) {
    console.error("Error checking GoodDollar claim status:", error);
    return {
      canClaim: false,
    };
  }
}

/**
 * Record GoodDollar claim in database
 */
export async function recordGoodDollarClaim(
  walletAddress: string,
  amount: string,
  txHash: string,
  autoContribute: boolean = false
): Promise<void> {
  try {
    // Find or create user
    const user = await prisma.user.upsert({
      where: { walletAddress: walletAddress.toLowerCase() },
      update: {},
      create: {
        walletAddress: walletAddress.toLowerCase(),
        isRegistered: false,
      },
    });

    // Record the claim as a contribution if auto-contribute is enabled
    if (autoContribute) {
      await prisma.contribution.create({
        data: {
          userId: user.id,
          amount: parseFloat(amount),
          currency: "G$",
          txHash,
          blockNumber: 0, // Will be updated by event indexer
          contributionType: "GOODDOLLAR",
          status: "CONFIRMED",
        },
      });

      // Log the activity
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "GOODDOLLAR_CLAIM_AND_CONTRIBUTE",
          entityType: "Contribution",
          metadata: {
            amount,
            txHash,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } else {
      // Just log the claim
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "GOODDOLLAR_CLAIM",
          entityType: "User",
          entityId: user.id,
          metadata: {
            amount,
            txHash,
            timestamp: new Date().toISOString(),
          },
        },
      });
    }
  } catch (error) {
    console.error("Error recording GoodDollar claim:", error);
    throw error;
  }
}

/**
 * Get user's GoodDollar balance
 */
export async function getGoodDollarBalance(
  walletAddress: string,
  network: "celo" | "fuse" = "celo"
): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(
      network === "celo"
        ? process.env.NEXT_PUBLIC_CELO_RPC_URL
        : "https://rpc.fuse.io"
    );

    const goodDollarAddress = getGoodDollarAddress(network);
    
    // ERC20 ABI (simplified)
    const erc20ABI = [
      "function balanceOf(address account) external view returns (uint256)",
    ];

    const goodDollar = new ethers.Contract(
      goodDollarAddress,
      erc20ABI,
      provider
    );

    const balance = await goodDollar.balanceOf(walletAddress);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting GoodDollar balance:", error);
    return "0";
  }
}

/**
 * Get user's claim history
 */
export async function getClaimHistory(walletAddress: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        activityLogs: {
          where: {
            action: {
              in: ["GOODDOLLAR_CLAIM", "GOODDOLLAR_CLAIM_AND_CONTRIBUTE"],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    return user?.activityLogs || [];
  } catch (error) {
    console.error("Error getting claim history:", error);
    return [];
  }
}

/**
 * Convert G$ to cUSD (approximate exchange rate)
 * Note: This is a simplified conversion. In production, use a price oracle
 */
export function convertGDollarToCUSD(gdAmount: string): string {
  // Approximate: 1 G$ ≈ 0.001 cUSD (this varies, use real exchange rate)
  const gdValue = parseFloat(gdAmount);
  const cusdValue = gdValue * 0.001;
  return cusdValue.toFixed(6);
}
