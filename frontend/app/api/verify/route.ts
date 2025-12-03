import { NextRequest, NextResponse } from "next/server";
import { SelfBackendVerifier, DefaultConfigStore, AllIds } from "@selfxyz/core";

// Initialize Self Protocol backend verifier
const selfBackendVerifier = new SelfBackendVerifier(
  "velora", // scope
  process.env.NEXT_PUBLIC_SELF_ENDPOINT || "https://playground.self.xyz/api/verify",
  process.env.NEXT_PUBLIC_GOODDOLLAR_ENV !== "production", // isStaging
  AllIds, // allowed ID types
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: [], // Add excluded countries if needed
    ofac: true, // Enable OFAC sanctions screening
  }),
  "hex" // userId type (wallet address in hex format)
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proof, userId } = body;

    if (!proof || !userId) {
      return NextResponse.json(
        { error: "Missing proof or userId" },
        { status: 400 }
      );
    }

    // Verify the proof from Self Protocol
    const verificationResult = await selfBackendVerifier.verify(proof, userId, [], '');

    if (verificationResult.isValidDetails.isValid) {
      // Store verification status in your database here
      // Example:
      // await db.users.update({
      //   where: { address: userId },
      //   data: { selfVerified: true, verifiedAt: new Date() }
      // });

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Identity verification successful",
        userId,
        details: verificationResult.isValidDetails
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: "Identity verification failed",
          error: "Verification details are not valid",
          details: verificationResult.isValidDetails
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        error: "Internal server error during verification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Self Protocol Verification API",
    environment: process.env.NEXT_PUBLIC_GOODDOLLAR_ENV || "development",
  });
}
