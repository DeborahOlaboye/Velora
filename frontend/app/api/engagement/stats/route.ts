import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/engagement/stats?address=0x...
 *
 * Get engagement and invite statistics for a user
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
        invitedUsers: {
          select: {
            walletAddress: true,
            isRegistered: true,
            hasClaimedEngagementReward: true,
            createdAt: true,
          },
        },
        engagementRewards: {
          where: {
            status: "CLAIMED",
          },
          select: {
            amount: true,
            currency: true,
            rewardType: true,
            claimedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        totalInvites: 0,
        successfulInvites: 0,
        pendingInvites: 0,
        totalRewardsEarned: "0",
        hasClaimedRegistrationReward: false,
        invitedByAddress: null,
        invites: [],
      });
    }

    // Calculate statistics
    const totalInvites = user.invitedUsers.length;
    const successfulInvites = user.invitedUsers.filter(
      (invite) => invite.isRegistered && invite.hasClaimedEngagementReward
    ).length;
    const pendingInvites = user.invitedUsers.filter(
      (invite) => !invite.hasClaimedEngagementReward
    ).length;

    // Calculate total rewards earned from invites (inviter gets rewards when invitee registers)
    const inviterRewardPerUser = 5; // G$ per successful invite (adjust based on contract)
    const totalRewardsEarned = (successfulInvites * inviterRewardPerUser).toString();

    // Format invite list
    const invites = user.invitedUsers.map((invite) => ({
      address: invite.walletAddress,
      status: invite.hasClaimedEngagementReward
        ? "completed"
        : invite.isRegistered
        ? "registered"
        : "pending",
      registeredAt: invite.createdAt,
    }));

    return NextResponse.json({
      totalInvites,
      successfulInvites,
      pendingInvites,
      totalRewardsEarned,
      hasClaimedRegistrationReward: user.hasClaimedEngagementReward,
      invitedByAddress: user.invitedBy,
      invites,
      rewardsClaimed: user.engagementRewards.length,
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
