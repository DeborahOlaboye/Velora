import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

/**
 * Thirdweb Client Configuration
 * 
 * Configured for Celo network with gasless transaction support
 */

// Create thirdweb client
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Define Celo Alfajores Testnet
export const celoAlfajores = defineChain({
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpc: "https://alfajores-forno.celo-testnet.org",
  blockExplorers: [
    {
      name: "CeloScan",
      url: "https://alfajores.celoscan.io",
    },
  ],
  testnet: true,
});

// Define Celo Mainnet
export const celoMainnet = defineChain({
  id: 42220,
  name: "Celo Mainnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpc: "https://forno.celo.org",
  blockExplorers: [
    {
      name: "CeloScan",
      url: "https://celoscan.io",
    },
  ],
  testnet: false,
});

// Export active chain based on environment
export const activeChain =
  process.env.NODE_ENV === "production" ? celoMainnet : celoAlfajores;

// Contract addresses
export const BENEFITS_POOL_ADDRESS =
  process.env.NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS || "";

export const CUSD_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_CUSD_TOKEN_ADDRESS ||
  "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Celo Alfajores cUSD

// Wallet configuration
export const walletConfig = {
  appName: "Velora",
  projectId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
  chains: [activeChain],
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
};

// Gasless transaction configuration
export const gaslessConfig = {
  // Enable gasless transactions for these actions
  sponsoredActions: [
    "registerWorker",
    "voteOnWithdrawal",
    "contribute", // For small contributions
  ],
  // Maximum gas to sponsor per transaction
  maxGasLimit: 500000,
  // Minimum balance required to use gasless (0 = always allow)
  minBalanceRequired: "0",
};

/**
 * Check if an action is eligible for gas sponsorship
 */
export function isGaslessEligible(action: string): boolean {
  return gaslessConfig.sponsoredActions.includes(action);
}

/**
 * Get gas sponsorship status
 */
export async function getGasSponsorshipStatus(): Promise<{
  enabled: boolean;
  budget: string;
  used: string;
}> {
  try {
    // In production, this would call thirdweb's API to check sponsorship status
    // For now, return mock data
    return {
      enabled: true,
      budget: "1000", // $1000 monthly budget
      used: "150", // $150 used this month
    };
  } catch (error) {
    console.error("Error checking gas sponsorship status:", error);
    return {
      enabled: false,
      budget: "0",
      used: "0",
    };
  }
}
