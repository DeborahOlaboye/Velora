import { SelfBackendVerifier, DefaultConfigStore, AllIds } from "@selfxyz/core";

/**
 * Self Protocol Backend Verifier
 *
 * Verifies identity proofs submitted by users through Self Protocol
 */

// Create the backend verifier instance
export function createSelfBackendVerifier() {
  const scope = process.env.NEXT_PUBLIC_SELF_SCOPE || "velora-benefits-pool";
  const endpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify`;
  const mockPassport = process.env.NEXT_PUBLIC_SELF_ENDPOINT?.includes("staging") ?? false;

  return new SelfBackendVerifier(
    scope,
    endpoint,
    mockPassport, // true = testnet, false = mainnet
    AllIds, // Accept all document types (Passport, ID cards, etc.)
    new DefaultConfigStore({
      minimumAge: 18, // Minimum age requirement
      excludedCountries: [], // No country restrictions for gig workers
      ofac: false, // OFAC sanctions check disabled
    }),
    "hex" // User identifier type (matches wallet address format)
  );
}

/**
 * Verify a Self Protocol proof
 */
export async function verifySelfProof(
  attestationId: 1 | 2 | 3,
  proof: any,
  publicSignals: string[],
  userContextData: string
) {
  try {
    const verifier = createSelfBackendVerifier();

    const result = await verifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    return {
      success: true,
      verified: result.isValidDetails.isValid && result.isValidDetails.isMinimumAgeValid,
      details: result,
    };
  } catch (error) {
    console.error("Self Protocol verification error:", error);
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
