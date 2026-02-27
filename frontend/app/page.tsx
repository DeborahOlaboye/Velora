"use client";

import Link from "next/link";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  Shield,
  Users,
  Wallet,
  CheckCircle,
  TrendingUp,
  Lock,
  Globe
} from "lucide-react";

export default function Home() {
  const account = useActiveAccount();
  const router = useRouter();

  // Redirect to dashboard when wallet is connected
  useEffect(() => {
    if (account) {
      router.push("/dashboard");
    }
  }, [account, router]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-8">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Financial Security for
              <span className="block text-blue-200">Gig Workers</span>
            </h1>

            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Build an emergency fund together. Access community support when you need it most.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!account ? (
                <div className="flex flex-col items-center gap-4">
                  <ConnectWalletButton />
                  <p className="text-sm text-blue-200">
                    Connect your wallet to get started
                  </p>
                </div>
              ) : (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl">
                      Open Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                      Register as Worker
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Built on Celo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Members</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Transparent & On-Chain</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Access Your Funds</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">0%</div>
              <div className="text-gray-600">Platform Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Velora Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and designed for gig workers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl mb-6">
                  1
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Register & Contribute</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Connect your wallet, complete registration, and start contributing to the mutual aid pool
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-600 text-white font-bold text-xl mb-6">
                  2
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Build Your Safety Net</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Your contributions grow your emergency fund and unlock higher withdrawal limits
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 text-white font-bold text-xl mb-6">
                  3
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Access When Needed</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Request withdrawals during emergencies, backed by community voting and support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built for Workers, By Workers
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to secure your financial future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Identity</h3>
              <p className="text-gray-600 text-sm">
                Self Protocol verification ensures all members are real gig workers
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Secured</h3>
              <p className="text-gray-600 text-sm">
                Your funds are protected by Celo blockchain technology
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600 text-sm">
                Democratic voting on withdrawal requests by verified members
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiered Benefits</h3>
              <p className="text-gray-600 text-sm">
                Access up to 200% of contributions with verification
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GoodDollar UBI</h3>
              <p className="text-gray-600 text-sm">
                Claim universal basic income and grow your contributions
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent</h3>
              <p className="text-gray-600 text-sm">
                All transactions and votes recorded on blockchain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Secure Your Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of gig workers building financial resilience together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!account ? (
              <div className="flex flex-col items-center gap-4">
                <ConnectWalletButton />
                <p className="text-sm text-blue-200">
                  Connect your wallet to access all features
                </p>
              </div>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold">
                    Open Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    Register as Worker
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
                <span className="text-white font-bold text-xl">Velora</span>
              </div>
              <p className="text-sm">
                Mutual aid for the modern worker. Built on Celo blockchain.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/contribute" className="hover:text-white">Contribute</Link></li>
                <li><Link href="/withdrawals" className="hover:text-white">Withdrawals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://celoscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-white">Block Explorer</a></li>
                <li><a href="https://docs.celo.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">Celo Docs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 Velora. Built for gig workers, by gig workers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
