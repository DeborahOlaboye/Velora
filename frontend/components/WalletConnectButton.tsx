'use client'

import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { appKit } from '@/context/WalletProvider'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

export function WalletConnectButton() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!mounted) {
    return <Button disabled>Loading...</Button>
  }

  if (isConnected && address) {
    return (
      <Button 
        variant="outline"
        onClick={() => disconnect()}
        className="font-mono"
      >
        {formatAddress(address)}
      </Button>
    )
  }

  return (
    <Button 
      onClick={() => appKit.open()}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
    >
      Connect Wallet
    </Button>
  )
}
