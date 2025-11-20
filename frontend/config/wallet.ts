import { createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'default-project-id'

// Define Celo Sepolia Testnet
const celoSepolia = defineChain({
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
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://sepolia.celoscan.io',
    },
  },
  testnet: true,
})

// Define Celo Mainnet
const celoMainnet = defineChain({
  id: 42220,
  caipNetworkId: 'eip155:42220',
  chainNamespace: 'eip155',
  name: 'Celo Mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://celoscan.io',
    },
  },
  testnet: false,
})

export const networks = [celoSepolia, celoMainnet]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [celoSepolia.id]: http('https://rpc.ankr.com/celo_sepolia'),
    [celoMainnet.id]: http('https://forno.celo.org')
  }
})

export const config = wagmiAdapter.wagmiConfig
