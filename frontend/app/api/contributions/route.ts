import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/contributions?address=0x...&limit=10
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!address) {
      return NextResponse.json({ error: "Address parameter required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const contributions = await prisma.contribution.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    // Calculate total contributions
    const total = await prisma.contribution.aggregate({
      where: { userId: user.id, status: "CONFIRMED" },
      _sum: { amount: true },
      _count: true,
    });

    return NextResponse.json({
      contributions,
      summary: {
        total: total._sum.amount || 0,
        count: total._count || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/contributions - Record a new contribution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, amount, txHash, blockNumber, contributionType } = body;

    if (!walletAddress || !amount || !txHash || !blockNumber) {
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

    // Check if contribution already exists
    const existing = await prisma.contribution.findUnique({
      where: { txHash },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Contribution already recorded" },
        { status: 409 }
      );
    }

    const contribution = await prisma.contribution.create({
      data: {
        userId: user.id,
        amount,
        txHash,
        blockNumber,
        contributionType: contributionType || "MONTHLY",
        status: "CONFIRMED",
        timestamp: new Date(),
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "CONTRIBUTE",
        entityType: "Contribution",
        entityId: contribution.id,
        metadata: { amount, txHash },
      },
    });

    return NextResponse.json({ contribution }, { status: 201 });
  } catch (error) {
    console.error("Error creating contribution:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
