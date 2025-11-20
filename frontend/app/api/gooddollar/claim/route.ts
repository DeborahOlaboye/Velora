import { NextRequest, NextResponse } from "next/server";
import { recordGoodDollarClaim } from "@/lib/gooddollar";

/**
 * GoodDollar Claim API
 * 
 * Records GoodDollar claims and optional auto-contributions
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, amount, txHash, autoContribute } = body;

    // Validate input
    if (!walletAddress || !amount || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields: walletAddress, amount, txHash" },
        { status: 400 }
      );
    }

    // Record the claim
    await recordGoodDollarClaim(
      walletAddress,
      amount,
      txHash,
      autoContribute || false
    );

    return NextResponse.json({
      success: true,
      message: autoContribute
        ? "Claim recorded and contributed to pool"
        : "Claim recorded successfully",
      walletAddress,
      amount,
      autoContribute,
    });
  } catch (error) {
    console.error("Error recording GoodDollar claim:", error);
    return NextResponse.json(
      {
        error: "Failed to record claim",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get claim status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    const network = (searchParams.get("network") as "celo" | "fuse") || "celo";

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing walletAddress parameter" },
        { status: 400 }
      );
    }

    const { canClaimGoodDollar, getClaimHistory } = await import("@/lib/gooddollar");

    const [claimStatus, history] = await Promise.all([
      canClaimGoodDollar(walletAddress, network),
      getClaimHistory(walletAddress),
    ]);

    return NextResponse.json({
      success: true,
      claimStatus,
      history,
    });
  } catch (error) {
    console.error("Error getting claim status:", error);
    return NextResponse.json(
      {
        error: "Failed to get claim status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
