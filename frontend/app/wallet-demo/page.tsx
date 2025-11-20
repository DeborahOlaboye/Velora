'use client'

import { ReownConnectButton, NetworkSwitcher } from '@/components/wallet/reown-connect-button'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { BrowserProvider, formatEther } from 'ethers'
import { Wallet, Network, Coins, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * Wallet Demo Page
 * 
 * Demonstrates Reown AppKit integration with:
 * - Wallet connection
 * - Network switching
 * - Balance checking
 * - Transaction signing
 */

export default function WalletDemoPage() {
  const { address, isConnected } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const { walletProvider } = useAppKitProvider('eip155')
  
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)

  // Fetch balance when connected
  useEffect(() => {
    if (isConnected && address && walletProvider) {
      fetchBalance()
    }
  }, [isConnected, address, walletProvider, chainId])

  const fetchBalance = async () => {
    if (!walletProvider || !address) return

    try {
      setLoading(true)
      const provider = new BrowserProvider(walletProvider)
      const balance = await provider.getBalance(address)
      setBalance(formatEther(balance))
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  const signMessage = async () => {
    if (!walletProvider || !address) return

    try {
      setLoading(true)
      const provider = new BrowserProvider(walletProvider)
      const signer = await provider.getSigner()
      const message = `Welcome to Velora!\n\nSign this message to verify your wallet.\n\nAddress: ${address}\nTimestamp: ${new Date().toISOString()}`
      
      const signature = await signer.signMessage(message)
      alert(`Message signed!\n\nSignature: ${signature.slice(0, 20)}...`)
    } catch (error) {
      console.error('Error signing message:', error)
      alert('Failed to sign message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Wallet Demo
          </h1>
          <p className="text-gray-600">
            Test Reown AppKit integration with Celo Sepolia
          </p>
        </div>

        {/* Connect Button */}
        <div className="mb-8 flex items-center gap-4">
          <ReownConnectButton />
          {isConnected && <NetworkSwitcher />}
        </div>

        {/* Connection Status */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm font-medium">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {address && (
                  <p className="text-xs text-gray-600 font-mono break-all">
                    {address}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {chainId === 11142220 ? 'Celo Sepolia Testnet' : 
                   chainId === 42220 ? 'Celo Mainnet' : 
                   chainId ? `Chain ID: ${chainId}` : 'Not connected'}
                </p>
                {chainId && (
                  <p className="text-xs text-gray-600">
                    Chain ID: {chainId}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  {loading ? '...' : parseFloat(balance).toFixed(4)} CELO
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchBalance}
                  disabled={!isConnected || loading}
                >
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Wallet Actions</CardTitle>
              <CardDescription>
                Test wallet interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  onClick={signMessage}
                  disabled={loading}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Sign Message
                </Button>

                <Button
                  variant="outline"
                  onClick={fetchBalance}
                  disabled={loading}
                  className="w-full"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Check Balance
                </Button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  How to use:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Click "Connect Wallet" to open the modal</li>
                  <li>Select your preferred wallet (MetaMask, Coinbase, etc.)</li>
                  <li>Approve the connection</li>
                  <li>Make sure you're on Celo Sepolia network</li>
                  <li>Get test tokens from the faucet</li>
                  <li>Try signing a message or checking your balance</li>
                </ul>
              </div>

              {/* Faucet Link */}
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  Need test tokens?
                </h3>
                <p className="text-sm text-green-800 mb-2">
                  Get free CELO tokens for testing on Celo Sepolia
                </p>
                <a
                  href="https://faucet.celo.org/sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800"
                >
                  Visit Celo Faucet →
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Not Connected State */}
        {!isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to start using Velora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  Click the "Connect Wallet" button above to get started
                </p>
                <div className="max-w-md mx-auto text-left">
                  <h4 className="font-semibold mb-2">Supported Wallets:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>MetaMask</li>
                    <li>Coinbase Wallet</li>
                    <li>Rainbow</li>
                    <li>Trust Wallet</li>
                    <li>WalletConnect (any wallet)</li>
                    <li>Email login (via Reown)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
