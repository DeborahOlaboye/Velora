import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/engagement/track
 *
 * Track engagement reward claims in the database
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

    // Find or create user
    const user = await prisma.user.upsert({
      where: { walletAddress: userAddress.toLowerCase() },
      update: {},
      create: {
        walletAddress: userAddress.toLowerCase(),
        isRegistered: false,
      },
    });

    // Update engagement reward status
    if (success && txHash) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          hasClaimedEngagementReward: true,
          engagementRewardClaimedAt: new Date(timestamp),
          engagementRewardTxHash: txHash,
        },
      });

      // Create engagement reward record
      await prisma.engagementReward.create({
        data: {
          userId: user.id,
          rewardType: "REGISTRATION",
          amount: 10, // Default registration reward amount
          currency: "G$",
          inviterAddress: inviterAddress?.toLowerCase() || null,
          txHash,
          status: "CLAIMED",
          claimedAt: new Date(timestamp),
        },
      });

      // Update inviter stats if applicable
      if (inviterAddress) {
        try {
          const inviter = await prisma.user.findUnique({
            where: { walletAddress: inviterAddress.toLowerCase() },
          });

          if (inviter) {
            await prisma.user.update({
              where: { id: inviter.id },
              data: {
                successfulInvites: { increment: 1 },
              },
            });
          }
        } catch (error) {
          console.error("Error updating inviter stats:", error);
          // Don't fail the whole request if inviter update fails
        }
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "ENGAGEMENT_REWARD_CLAIMED",
          entityType: "EngagementReward",
          metadata: {
            txHash,
            inviterAddress,
            timestamp,
            success,
          },
        },
      });
    }

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
