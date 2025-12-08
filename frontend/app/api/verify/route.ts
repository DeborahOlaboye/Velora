import { NextRequest, NextResponse } from "next/server";
import { createSelfBackendVerifier } from "@/lib/self-backend-verifier";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/verify
 *
 * Verifies Self Protocol identity proofs.
 * This endpoint is called by Self's relayers after the user completes verification.
 *
 * IMPORTANT: Always return status 200 (per Self Protocol docs)
 * IMPORTANT: During development, use ngrok to make this endpoint publicly accessible
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attestationId, proof, publicSignals, userContextData } = body;

    // Validate required fields (per Self Protocol API spec)
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return NextResponse.json(
        {
          status: "error",
          result: false,
          reason: "Proof, publicSignals, attestationId and userContextData are required",
        },
        { status: 200 } // Always return 200
      );
    }

    // Verify the proof using Self Backend Verifier
    const selfBackendVerifier = createSelfBackendVerifier();
    const result = await selfBackendVerifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    // Check if verification passed
    const { isValid, isMinimumAgeValid } = result.isValidDetails;
    if (!isValid || !isMinimumAgeValid) {
      let reason = "Verification failed";
      if (!isMinimumAgeValid) reason = "Minimum age verification failed (must be 18+)";

      return NextResponse.json(
        {
          status: "error",
          result: false,
          reason,
        },
        { status: 200 }
      );
    }

    // Extract user identifier (wallet address)
    const userIdentifier = result.userData?.userIdentifier;

    if (userIdentifier) {
      try {
        // Update user verification status in database
        const user = await prisma.user.findUnique({
          where: { walletAddress: userIdentifier.toLowerCase() },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isSelfVerified: true,
              selfVerifiedAt: new Date(),
              selfUserId: userIdentifier,
            },
          });

          // Log the verification activity
          await prisma.activityLog.create({
            data: {
              userId: user.id,
              action: "IDENTITY_VERIFIED",
              entityType: "User",
              entityId: user.id,
              metadata: {
                attestationId,
                nationality: result.discloseOutput?.nationality,
                gender: result.discloseOutput?.gender,
                minimumAge: result.discloseOutput?.minimumAge,
                verifiedAt: new Date().toISOString(),
              },
            },
          });

          console.log(`✅ User ${userIdentifier} verified successfully`);
        }
      } catch (dbError) {
        console.error("Database error during verification:", dbError);
        // Continue anyway - the proof is valid even if DB update fails
      }
    }

    // Return success (per Self Protocol API spec)
    return NextResponse.json(
      {
        status: "success",
        result: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      {
        status: "error",
        result: false,
        reason: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 } // Always return 200
    );
  }
}

/**
 * GET /api/verify
 *
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Self Protocol Verification API",
    endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/verify`,
    scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "velora-benefits-pool",
    environment: process.env.NEXT_PUBLIC_SELF_ENDPOINT?.includes("staging") ? "staging" : "production",
  });
}
