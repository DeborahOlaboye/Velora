'use client'

import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Wallet, LogOut, Network } from 'lucide-react'

/**
 * Reown AppKit Connect Button
 * 
 * Following official Reown documentation:
 * https://docs.reown.com/appkit/react/core/hooks
 */

export function ReownConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected, caipAddress, status } = useAppKitAccount()
  const { chainId, caipNetworkId } = useAppKitNetwork()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!mounted) {
    return (
      <Button disabled className="min-w-[160px]">
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Network Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
          <Network className="w-4 h-4 text-green-600" />
          <span className="text-gray-700">
            {chainId === 11142220 ? 'Sepolia' : chainId === 42220 ? 'Mainnet' : `Chain ${chainId}`}
          </span>
        </div>

        {/* Account Button */}
        <Button
          variant="outline"
          onClick={() => open()}
          className="font-mono min-w-[140px]"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(address)}
        </Button>

        {/* Disconnect Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => disconnect()}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => open()}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white min-w-[160px]"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  )
}

/**
 * Network Switcher Component
 */
export function NetworkSwitcher() {
  const { open } = useAppKit()
  const { chainId } = useAppKitNetwork()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => open({ view: 'Networks' })}
      className="gap-2"
    >
      <Network className="w-4 h-4" />
      {chainId === 11142220 ? 'Celo Sepolia' : chainId === 42220 ? 'Celo Mainnet' : 'Switch Network'}
    </Button>
  )
}

/**
 * Account Modal Trigger
 */
export function AccountButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isConnected || !address) return null

  return (
    <Button
      variant="ghost"
      onClick={() => open({ view: 'Account' })}
      className="font-mono"
    >
      {address.slice(0, 6)}...{address.slice(-4)}
    </Button>
  )
}
