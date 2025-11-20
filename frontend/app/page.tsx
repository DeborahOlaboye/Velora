"use client";

import Link from "next/link";
import { ReownConnectButton } from "@/components/wallet/reown-connect-button";
import { useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Velora
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Mutual Aid for the Modern Worker
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <p className="text-gray-700 mb-6">
            A decentralized platform built on Celo blockchain with Self Protocol verification,
            GoodDollar integration, and community-driven mutual aid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ReownConnectButton />
            {isConnected && (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Register
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
          {isConnected && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link href="/contribute">
                <Button size="sm" variant="ghost">Contribute</Button>
              </Link>
              <Link href="/withdrawals">
                <Button size="sm" variant="ghost">Withdrawals</Button>
              </Link>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Verified Identity</h3>
            <p className="text-gray-600 text-sm">
              Self Protocol ensures all members are verified gig workers
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Community Support</h3>
            <p className="text-gray-600 text-sm">
              Pool contributions with fellow workers for emergency funds
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">GoodDollar UBI</h3>
            <p className="text-gray-600 text-sm">
              Claim supplemental income and contribute to the pool
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
