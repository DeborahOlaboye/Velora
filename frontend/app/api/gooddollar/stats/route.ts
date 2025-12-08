import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { convertGDollarToCUSD } from "@/lib/gooddollar";

/**
 * GET /api/gooddollar/stats
 * Fetch GoodDollar claim statistics for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
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
        },
        contributions: {
          where: {
            contributionType: "GOODDOLLAR",
          },
        },
      },
    });

    // If user doesn't exist or has no claims, return empty stats
    if (!user || user.activityLogs.length === 0) {
      return NextResponse.json({
        totalClaimed: "0",
        claimCount: 0,
        lastClaimDate: null,
        claimStreak: 0,
        canClaimToday: true,
        nextClaimTime: null,
        equivalentCUSD: "0",
      });
    }

    // Calculate total claimed
    const totalClaimed = user.activityLogs.reduce((sum, log) => {
      const amount = parseFloat((log.metadata as any)?.amount || "0");
      return sum + amount;
    }, 0);

    // Get last claim date
    const lastClaimDate = user.activityLogs[0]?.createdAt || null;

    // Calculate claim streak
    const claimStreak = calculateClaimStreak(user.activityLogs);

    // Check if user can claim today
    const canClaimToday = lastClaimDate
      ? new Date().getTime() - new Date(lastClaimDate).getTime() >= 24 * 60 * 60 * 1000
      : true;

    // Calculate next claim time
    const nextClaimTime = lastClaimDate
      ? new Date(new Date(lastClaimDate).getTime() + 24 * 60 * 60 * 1000)
      : null;

    // Convert to cUSD equivalent
    const equivalentCUSD = convertGDollarToCUSD(totalClaimed.toString());

    return NextResponse.json({
      totalClaimed: totalClaimed.toFixed(6),
      claimCount: user.activityLogs.length,
      lastClaimDate,
      claimStreak,
      canClaimToday,
      nextClaimTime,
      equivalentCUSD,
    });
  } catch (error) {
    console.error("Error fetching GoodDollar stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

/**
 * Calculate claim streak (consecutive days of claiming)
 */
function calculateClaimStreak(activityLogs: any[]): number {
  if (activityLogs.length === 0) return 0;

  let streak = 1;
  const sortedLogs = [...activityLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (let i = 0; i < sortedLogs.length - 1; i++) {
    const currentDate = new Date(sortedLogs[i].createdAt);
    const nextDate = new Date(sortedLogs[i + 1].createdAt);

    // Reset to start of day for comparison
    currentDate.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);

    const dayDiff = Math.floor(
      (currentDate.getTime() - nextDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    // If claims are consecutive days (1 day apart), increment streak
    if (dayDiff === 1) {
      streak++;
    } else if (dayDiff > 1) {
      // Streak broken
      break;
    }
    // If dayDiff === 0, it's the same day, don't increment but continue
  }

  return streak;
}
