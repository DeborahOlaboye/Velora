'use client'

import { wagmiAdapter, projectId, networks } from '@/config/wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'Velora',
  description: 'Mutual Aid for the Modern Worker - A decentralized platform for gig workers on Celo',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://raw.githubusercontent.com/celo-org/celo-monorepo/master/packages/docs/static/img/celo-logo.png']
}

// Create the modal
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks,
  defaultNetwork: networks[0], // Celo Sepolia for development
  metadata: metadata,
  features: {
    analytics: false,
    email: false,
    socials: []
  }
})

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
