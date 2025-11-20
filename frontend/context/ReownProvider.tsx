'use client'

import { wagmiAdapter, projectId, networks, metadata } from '@/config/reown'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { WagmiProvider, type Config } from 'wagmi'

/**
 * Reown AppKit Provider for Velora
 * 
 * Following official Reown documentation:
 * https://docs.reown.com/appkit/react/core/installation
 */

// Set up queryClient
const queryClient = new QueryClient()

// Create the AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: networks[0], // Celo Sepolia for development
  metadata,
  features: {
    analytics: true, // Enable analytics
    email: true, // Enable email login
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook'], // Social logins
    emailShowWallets: true, // Show wallet options in email flow
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#00BF6F',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': '#00BF6F', // Celo green
  },
  allWallets: 'SHOW', // Show all available wallets
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  ],
  allowUnsupportedChain: false, // Only allow Celo Sepolia
  enableNetworkView: false, // Disable network switching UI
})

export function ReownProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Export modal for use in components
export { modal }
