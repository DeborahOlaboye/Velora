import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from '@reown/appkit/networks'

/**
 * Reown AppKit Configuration for Velora
 * 
 * Following official Reown documentation:
 * https://docs.reown.com/appkit/overview
 */

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'default-project-id'

// Define Celo Sepolia Testnet
export const celoSepolia = defineChain({
  id: 11142220,
  caipNetworkId: 'eip155:11142220',
  chainNamespace: 'eip155',
  name: 'Celo Sepolia Testnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/celo_sepolia'],
      webSocket: ['wss://rpc.ankr.com/celo_sepolia/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://sepolia.celoscan.io',
      apiUrl: 'https://api-sepolia.celoscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
  testnet: true,
})

// Define Celo Mainnet
export const celoMainnet = defineChain({
  id: 42220,
  caipNetworkId: 'eip155:42220',
  chainNamespace: 'eip155',
  name: 'Celo',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org'],
      webSocket: ['wss://forno.celo.org/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://celoscan.io',
      apiUrl: 'https://api.celoscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 13112599,
    },
  },
  testnet: false,
})

// Networks to support - Only Celo Sepolia for development
export const networks = [celoSepolia]

// Metadata for your app
export const metadata = {
  name: 'Velora',
  description: 'Mutual Aid for the Modern Worker - A decentralized platform for gig workers on Celo',
  url: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  icons: ['https://raw.githubusercontent.com/celo-org/celo-monorepo/master/packages/docs/static/img/celo-logo.png']
}

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
