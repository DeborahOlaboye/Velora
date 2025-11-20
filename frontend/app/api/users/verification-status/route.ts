import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * User Verification Status API
 * 
 * Check if a user is verified with Self Protocol
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing walletAddress" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      select: {
        isSelfVerified: true,
        selfVerifiedAt: true,
        isRegistered: true,
        registeredAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        verified: false,
        registered: false,
        message: "User not found",
      });
    }

    return NextResponse.json({
      verified: user.isSelfVerified,
      verifiedAt: user.selfVerifiedAt,
      registered: user.isRegistered,
      registeredAt: user.registeredAt,
    });
  } catch (error) {
    console.error("Error checking verification status:", error);
    return NextResponse.json(
      {
        error: "Failed to check verification status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get detailed user info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing walletAddress parameter" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        contributions: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        withdrawalRequests: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        isSelfVerified: user.isSelfVerified,
        selfVerifiedAt: user.selfVerifiedAt,
        isRegistered: user.isRegistered,
        registeredAt: user.registeredAt,
        contributionsCount: user.contributions.length,
        withdrawalRequestsCount: user.withdrawalRequests.length,
        recentContributions: user.contributions,
        recentWithdrawals: user.withdrawalRequests,
      },
    });
  } catch (error) {
    console.error("Error getting user info:", error);
    return NextResponse.json(
      {
        error: "Failed to get user info",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
