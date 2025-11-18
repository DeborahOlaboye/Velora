import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/users?address=0x...
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Address parameter required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
      include: {
        contributions: {
          take: 10,
          orderBy: { timestamp: "desc" },
        },
        withdrawalRequests: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/users - Create or update user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      gigWorkType,
      location,
      yearsExperience,
      monthlyIncome,
      monthlyContribution,
      isSelfVerified,
    } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { walletAddress: walletAddress.toLowerCase() },
      update: {
        gigWorkType,
        location,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
        monthlyIncome,
        monthlyContribution,
        isSelfVerified: isSelfVerified || false,
        selfVerifiedAt: isSelfVerified ? new Date() : null,
        isRegistered: true,
        registeredAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        walletAddress: walletAddress.toLowerCase(),
        gigWorkType,
        location,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
        monthlyIncome,
        monthlyContribution,
        isSelfVerified: isSelfVerified || false,
        selfVerifiedAt: isSelfVerified ? new Date() : null,
        isRegistered: true,
        registeredAt: new Date(),
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        entityType: "User",
        entityId: user.id,
        metadata: { gigWorkType, location },
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/users - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, ...updateData } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { walletAddress: walletAddress.toLowerCase() },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
