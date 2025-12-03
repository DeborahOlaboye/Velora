import { SelfBackendVerifier, DefaultConfigStore, AllIds } from "@selfxyz/core";

/**
 * Self Protocol Integration Service
 * 
 * Handles identity verification for Velora users
 * Ensures only verified individuals can participate in the mutual aid pool
 */

// Initialize Self Protocol backend verifier
export const selfBackendVerifier = new SelfBackendVerifier(
  process.env.NEXT_PUBLIC_SELF_SCOPE || "velora-app",
  process.env.NEXT_PUBLIC_SELF_ENDPOINT || "https://api.staging.self.xyz",
  process.env.NEXT_PUBLIC_GOODDOLLAR_ENV !== "production", // isStaging
  AllIds, // allowed ID types
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: [], // Add excluded countries if needed (e.g., ["KP", "IR"])
    ofac: true, // Enable OFAC sanctions screening
  }),
  "hex" // userId type (wallet address in hex format)
);

/**
 * Verify a Self Protocol proof
 */
export async function verifySelfProof(
  proof: any, // VcAndDiscloseProof type from @selfxyz/core
  userId: string
): Promise<{
  verified: boolean;
  error?: string;
  data?: any;
}> {
  try {
    // The verify method expects 4 parameters:
    // 1. attestationId: 1 | 2 | 3
    // 2. proof: VcAndDiscloseProof
    // 3. pubSignals: BigNumberish[]
    // 4. userContextData: string
    const result = await selfBackendVerifier.verify(1, proof, [], '');
    
    if (result.isValidDetails.isValid) {
      return {
        verified: result.isValidDetails.isValid,
        data: result,
      };
    } else {
      return {
        verified: false,
        error: "Verification failed: " + JSON.stringify(result.isValidDetails),
      };
    }
  } catch (error) {
    console.error("Self Protocol verification error:", error);
    return {
      verified: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if a user is verified
 */
export async function checkVerificationStatus(
  walletAddress: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/users/verification-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.verified || false;
  } catch (error) {
    console.error("Error checking verification status:", error);
    return false;
  }
}

/**
 * Initiate verification process
 */
export async function initiateVerification(walletAddress: string) {
  try {
    const response = await fetch("/api/verify/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate verification");
    }

    return await response.json();
  } catch (error) {
    console.error("Error initiating verification:", error);
    throw error;
  }
}

/**
 * Submit verification proof
 */
export async function submitVerificationProof(
  walletAddress: string,
  proof: string
) {
  try {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: walletAddress,
        proof,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting verification proof:", error);
    throw error;
  }
}
