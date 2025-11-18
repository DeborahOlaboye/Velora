import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/withdrawals?address=0x...&status=PENDING
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");
    const status = searchParams.get("status"); // PENDING, VOTING, APPROVED, REJECTED, EXECUTED
    const limit = parseInt(searchParams.get("limit") || "50");

    let where: any = {};

    if (address) {
      const user = await prisma.user.findUnique({
        where: { walletAddress: address.toLowerCase() },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      where.userId = user.id;
    }

    if (status) {
      where.status = status;
    }

    const withdrawals = await prisma.withdrawalRequest.findMany({
      where,
      include: {
        user: {
          select: {
            walletAddress: true,
            gigWorkType: true,
            location: true,
          },
        },
        votes: {
          select: {
            support: true,
            voterId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/withdrawals - Create withdrawal request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      amount,
      reason,
      urgencyLevel,
      requestId,
      txHash,
    } = body;

    if (!walletAddress || !amount || !reason || !requestId) {
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

    // Voting deadline: 7 days from now
    const votingDeadline = new Date();
    votingDeadline.setDate(votingDeadline.getDate() + 7);

    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        amount,
        reason,
        urgencyLevel: urgencyLevel || "MEDIUM",
        requestId,
        txHash,
        status: "VOTING",
        votingDeadline,
      },
    });

    // Create notification for all users
    const allUsers = await prisma.user.findMany({
      where: { isActive: true, isRegistered: true },
    });

    await prisma.notification.createMany({
      data: allUsers.map((u) => ({
        userId: u.id,
        type: "VOTING_REQUEST",
        title: "New Withdrawal Request",
        message: `A worker has requested ${amount} cUSD for emergency withdrawal. Please vote.`,
        metadata: { requestId: withdrawal.id },
      })),
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "REQUEST_WITHDRAWAL",
        entityType: "WithdrawalRequest",
        entityId: withdrawal.id,
        metadata: { amount, reason },
      },
    });

    return NextResponse.json({ withdrawal }, { status: 201 });
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
