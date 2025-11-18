import { createThirdwebClient, defineChain } from "thirdweb";

// Create thirdweb client
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

// Define Celo Sepolia testnet
export const celoSepolia = defineChain({
  id: 1740,
  name: "Celo Sepolia Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://alfajores-forno.celo-testnet.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://celo-alfajores.blockscout.com",
    },
  },
  testnet: true,
});

// Define Celo Alfajores testnet
export const celoAlfajores = defineChain({
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://alfajores-forno.celo-testnet.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://alfajores.celoscan.io",
    },
  },
  testnet: true,
});

// Define Celo Mainnet (for future use)
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

// Export the chain to use based on environment
export const activeChain =
  process.env.NODE_ENV === "production" ? celoMainnet : celoSepolia;

// Contract addresses
export const BENEFITS_POOL_ADDRESS =
  process.env.NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS || "";
export const CUSD_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_CUSD_TOKEN_ADDRESS ||
  "0x4822e58de6f5e485eF90df51C41CE01721331dC0"; // Celo Sepolia cUSD
