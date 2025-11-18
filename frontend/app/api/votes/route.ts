import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/votes - Cast a vote on withdrawal request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, withdrawalId, support, comment, txHash } = body;

    if (!walletAddress || !withdrawalId || support === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already voted
    const existing = await prisma.vote.findUnique({
      where: {
        requestId_voterId: {
          requestId: withdrawalId,
          voterId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already voted on this request" },
        { status: 409 }
      );
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        requestId: withdrawalId,
        voterId: user.id,
        support,
        comment,
        txHash,
      },
    });

    // Update withdrawal request vote counts
    const withdrawal = await prisma.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        votesFor: support
          ? { increment: 1 }
          : undefined,
        votesAgainst: !support
          ? { increment: 1 }
          : undefined,
      },
      include: {
        user: true,
      },
    });

    // Notify the requester
    await prisma.notification.create({
      data: {
        userId: withdrawal.userId,
        type: "VOTE_CAST",
        title: "New Vote on Your Withdrawal Request",
        message: `Someone ${support ? "approved" : "denied"} your withdrawal request.`,
        metadata: { withdrawalId, support },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "VOTE",
        entityType: "Vote",
        entityId: vote.id,
        metadata: { withdrawalId, support },
      },
    });

    return NextResponse.json({ vote, withdrawal }, { status: 201 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/votes?withdrawalId=...
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const withdrawalId = searchParams.get("withdrawalId");

    if (!withdrawalId) {
      return NextResponse.json(
        { error: "Withdrawal ID required" },
        { status: 400 }
      );
    }

    const votes = await prisma.vote.findMany({
      where: { requestId: withdrawalId },
      include: {
        voter: {
          select: {
            walletAddress: true,
            gigWorkType: true,
          },
        },
      },
      orderBy: { votedAt: "desc" },
    });

    const summary = {
      total: votes.length,
      for: votes.filter((v) => v.support).length,
      against: votes.filter((v) => !v.support).length,
    };

    return NextResponse.json({ votes, summary });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
