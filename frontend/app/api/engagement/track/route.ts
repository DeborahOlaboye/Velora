import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/engagement/track
 *
 * Track engagement reward claims (simplified - no database)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, inviterAddress, txHash, success, timestamp } = body;

    if (!userAddress) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      );
    }

    // Just log to console for now
    console.log("Engagement reward claimed:", {
      user: userAddress,
      inviter: inviterAddress,
      txHash,
      success,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: "Engagement reward tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking engagement reward:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
