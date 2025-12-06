"use client";

import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const account = useActiveAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Velora</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {account ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/contribute"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Contribute
                </Link>
                <Link
                  href="/withdrawals"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Withdrawals
                </Link>
                <Link
                  href="/verify"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Verify
                </Link>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Connect wallet to access features
              </div>
            )}
          </div>

          {/* Wallet Button */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ConnectWalletButton />
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {account ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/contribute"
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contribute
                  </Link>
                  <Link
                    href="/withdrawals"
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Withdrawals
                  </Link>
                  <Link
                    href="/verify"
                    className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Verify
                  </Link>
                </>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Connect wallet to access features
                </div>
              )}
              <div className="px-3 pt-3 border-t border-gray-200">
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
