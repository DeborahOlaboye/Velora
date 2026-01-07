import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/engagement/stats?address=0x...
 *
 * Get engagement and invite statistics for a user
 *
 * NOTE: This currently returns mock data until database migration is run
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

    // TODO: Uncomment after running database migration
    // For now, return default values
    return NextResponse.json({
      totalInvites: 0,
      successfulInvites: 0,
      pendingInvites: 0,
      totalRewardsEarned: "0",
      hasClaimedRegistrationReward: false,
      invitedByAddress: null,
      invites: [],
      rewardsClaimed: 0,
    });
  } catch (error) {
    console.error("Error fetching engagement stats:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
