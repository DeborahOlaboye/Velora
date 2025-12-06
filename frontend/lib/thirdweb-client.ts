import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

/**
 * Thirdweb Client Configuration
 * 
 * Configured for Celo network with gasless transaction support
 */

// Get client ID from environment or use default for development
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "2bb6ec5ab2beba542d1be1aa6c5c7661";

// Create thirdweb client
export const client = createThirdwebClient({
  clientId,
});

// Define Celo Sepolia Testnet
export const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/celo_sepolia"],
    },
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://sepolia.celoscan.io",
    },
  },
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
  rpcUrls: {
    default: {
      http: ["https://forno.celo.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://celoscan.io",
    },
  },
  testnet: false,
});

// Export active chain based on CHAIN_ID from env
// This uses the NEXT_PUBLIC_CHAIN_ID from .env.local
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "42220");
export const activeChain = chainId === 42220 ? celoMainnet : celoSepolia;

// Contract addresses
export const BENEFITS_POOL_ADDRESS =
  process.env.NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS || "";

// cUSD addresses by network
const CUSD_ADDRESSES = {
  sepolia: "0x00BFD44e79FB7f6dd5887A9426c8EF85A0CD23e0", // Celo Sepolia
  mainnet: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // Celo Mainnet (Mento)
};

export const CUSD_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_CUSD_TOKEN_ADDRESS ||
  (chainId === 42220
    ? CUSD_ADDRESSES.mainnet
    : CUSD_ADDRESSES.sepolia);

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
