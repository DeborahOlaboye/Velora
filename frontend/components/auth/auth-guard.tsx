"use client";

import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useRouter, usePathname } from "next/navigation";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield } from "lucide-react";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Pages that don't require authentication
const PUBLIC_PAGES = ["/", "/docs", "/about", "/how-it-works"];

// Pages that require wallet connection but not registration
const WALLET_ONLY_PAGES = ["/register"];

export function AuthGuard({ children }: AuthGuardProps) {
  const account = useActiveAccount();
  const router = useRouter();
  const pathname = usePathname();
  const { workerInfo, isLoading } = useWorkerInfo(account?.address);

  const isPublicPage = PUBLIC_PAGES.includes(pathname);
  const isWalletOnlyPage = WALLET_ONLY_PAGES.includes(pathname);

  useEffect(() => {
    // Don't redirect on public pages
    if (isPublicPage) return;

    // If we're still loading worker info, wait
    if (isLoading) return;

    // If wallet is connected
    if (account) {
      // If user is registered and trying to access /register, redirect to dashboard
      if (pathname === "/register" && workerInfo?.isRegistered) {
        router.push("/dashboard");
        return;
      }

      // If user is NOT registered and trying to access protected pages, redirect to register
      if (!workerInfo?.isRegistered && !isWalletOnlyPage) {
        router.push("/register");
        return;
      }
    }
  }, [account, workerInfo, isLoading, pathname, router, isPublicPage, isWalletOnlyPage]);

  // For public pages, always show content
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Show loading while checking registration status
  if (isLoading && account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no wallet connected and not on a public page, show connect prompt
  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription className="text-base">
              Connect your wallet to access Velora
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                All pages require wallet connection. Connect your wallet to continue.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <ConnectWalletButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If wallet connected but not registered and trying to access protected pages
  if (!workerInfo?.isRegistered && !isWalletOnlyPage) {
    // The useEffect will handle the redirect
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Redirecting to registration...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, show the protected content
  return <>{children}</>;
}
