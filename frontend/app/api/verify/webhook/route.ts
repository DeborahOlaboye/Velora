import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";

/**
 * Self Protocol Webhook Handler
 * 
 * This endpoint receives verification callbacks from Self Protocol
 * and automatically updates the user's verification status in the database
 * and on the smart contract.
 */

// Verify webhook signature to ensure it's from Self Protocol
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");
    return signature === expectedSignature;
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-self-signature") || "";
    
    // Verify the webhook signature
    const webhookSecret = process.env.SELF_PROTOCOL_WEBHOOK_SECRET || "";
    if (webhookSecret && !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    console.log("Received Self Protocol webhook:", event);

    // Handle verification success event
    if (event === "verification.completed" || event === "verification.success") {
      const {
        userId,
        selfUserId,
        verified,
        verificationData,
      } = data;

      if (!userId) {
        return NextResponse.json(
          { error: "Missing userId in webhook payload" },
          { status: 400 }
        );
      }

      // Update user in database
      const user = await prisma.user.upsert({
        where: { walletAddress: userId.toLowerCase() },
        update: {
          isSelfVerified: verified,
          selfVerifiedAt: verified ? new Date() : null,
          selfUserId: selfUserId || null,
        },
        create: {
          walletAddress: userId.toLowerCase(),
          isSelfVerified: verified,
          selfVerifiedAt: verified ? new Date() : null,
          selfUserId: selfUserId || null,
          isRegistered: false,
        },
      });

      console.log("User verification status updated:", user.walletAddress);

      // If verified, call smart contract to verify worker
      if (verified && user.isRegistered) {
        try {
          await verifyWorkerOnChain(userId);
          console.log("Worker verified on-chain:", userId);
        } catch (error) {
          console.error("Failed to verify worker on-chain:", error);
          // Don't fail the webhook - we can retry this later
        }
      }

      // Log the activity
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "SELF_VERIFICATION",
          entityType: "User",
          entityId: user.id,
          metadata: {
            verified,
            selfUserId,
            timestamp: new Date().toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Verification status updated",
        userId,
        verified,
      });
    }

    // Handle verification failure event
    if (event === "verification.failed") {
      const { userId, reason } = data;

      if (userId) {
        await prisma.user.update({
          where: { walletAddress: userId.toLowerCase() },
          data: {
            isSelfVerified: false,
            selfVerifiedAt: null,
          },
        });

        console.log("Verification failed for user:", userId, "Reason:", reason);
      }

      return NextResponse.json({
        success: true,
        message: "Verification failure recorded",
        userId,
      });
    }

    // Unknown event type
    console.log("Unknown webhook event:", event);
    return NextResponse.json({
      success: true,
      message: "Event received but not processed",
      event,
    });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Verify worker on the smart contract
 * This should be called by a backend service with owner/verifier privileges
 */
async function verifyWorkerOnChain(walletAddress: string): Promise<void> {
  // This requires a backend wallet with verifier role
  // For security, this should be done through a separate service
  // with proper key management (e.g., AWS KMS, Google Cloud KMS)
  
  const rpcUrl = process.env.NEXT_PUBLIC_CELO_RPC_URL;
  const contractAddress = process.env.NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS;
  const verifierPrivateKey = process.env.VERIFIER_PRIVATE_KEY;

  if (!rpcUrl || !contractAddress || !verifierPrivateKey) {
    throw new Error("Missing required environment variables for on-chain verification");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const verifierWallet = new ethers.Wallet(verifierPrivateKey, provider);

  // BenefitsPool contract ABI (just the verifyWorker function)
  const contractABI = [
    "function verifyWorker(address _worker) external",
  ];

  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    verifierWallet
  );

  // Call verifyWorker on the contract
  const tx = await contract.verifyWorker(walletAddress);
  await tx.wait();

  console.log("Worker verified on-chain. Transaction:", tx.hash);
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Self Protocol Webhook Handler",
    timestamp: new Date().toISOString(),
  });
}
