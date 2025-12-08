"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { WorkerProfile } from "@/components/profile/worker-profile";
import { ClaimWidget } from "@/components/gooddollar/claim-widget";
import { GoodDollarStats } from "@/components/gooddollar/gooddollar-stats";
import { SelfProtocolVerifier } from "@/components/verification/self-protocol-verifier";
import { PoolStats } from "@/components/pool/pool-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import {
  TrendingUp,
  CheckCircle2,
  Shield,
  DollarSign,
  Wallet,
  ArrowRight,
  Loader2,
  Plus,
  Send,
  AlertCircle
} from "lucide-react";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { useWithdrawalLimits } from "@/hooks/useWithdrawalLimits";
import { useCUSDBalance } from "@/hooks/useCUSDBalance";
import { formatTokenAmount, formatDisplayAmount } from "@/lib/token-utils";

export default function DashboardPage() {
  const account = useActiveAccount();
  const router = useRouter();
  const { workerInfo, isLoading: workerLoading } = useWorkerInfo(account?.address);
  const { limits, isLoading: limitsLoading } = useWithdrawalLimits(account?.address);
  const { balance: cUSDBalance, isLoading: balanceLoading } = useCUSDBalance(account?.address);
  const [isVerified, setIsVerified] = useState(false);

  // Get data from smart contract
  const totalContributions = workerInfo?.totalContributions
    ? Number(formatTokenAmount(workerInfo.totalContributions))
    : 0;
  const isWorkerVerified = workerInfo?.isVerified || false;
  const isLoading = workerLoading || limitsLoading || balanceLoading;

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center px-4 py-24">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center">Connect Your Wallet</CardTitle>
              <CardDescription className="text-center">
                Connect your wallet to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ConnectWalletButton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Manage your participation in the benefits pool
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </CardContent>
          </Card>
        )}

        {/* Registration Prompt */}
        {!isLoading && !workerInfo?.isRegistered && (
          <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Registration Required</p>
                  <p className="text-sm text-blue-700">
                    Register as a worker to start contributing and accessing benefits
                  </p>
                </div>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Verification Alert for Unverified Users */}
        {!isLoading && !isWorkerVerified && workerInfo?.isRegistered && totalContributions > 0 && (
          <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-6">
            <Shield className="h-5 w-5 text-purple-600" />
            <AlertDescription>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-purple-900 mb-1">
                    Unlock Higher Limits with Verification
                  </p>
                  <p className="text-sm text-purple-800 mb-3">
                    Verify your identity to access up to 200% of your contributions during emergencies
                  </p>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Current: <strong>{formatDisplayAmount(totalContributions)} cUSD</strong> (Tier 1)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        With verification: <strong>{formatDisplayAmount(totalContributions * 2)} cUSD</strong> (Tier 2)
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/verify')}
                  className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                >
                  Verify Identity
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Verified Success Banner */}
        {!isLoading && isWorkerVerified && (
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription>
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-green-900">Identity Verified</p>
                  <p className="text-sm text-green-700">
                    You have full access to Tier 2 benefits - up to {formatDisplayAmount(totalContributions * 2)} cUSD withdrawal limit
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Pool Statistics */}
        <PoolStats />

        {/* Quick Stats Cards - Only for registered users */}
        {!isLoading && workerInfo?.isRegistered && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Wallet Balance */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Wallet Balance</CardTitle>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {cUSDBalance ? formatTokenAmount(cUSDBalance) : "0"}
                  </div>
                  <p className="text-sm text-gray-500">cUSD Available</p>
                </CardContent>
              </Card>

              {/* Total Contributions */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Contributions</CardTitle>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatDisplayAmount(totalContributions)}
                  </div>
                  <p className="text-sm text-gray-500">cUSD Contributed</p>
                </CardContent>
              </Card>

              {/* Verification Status */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isWorkerVerified ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Shield className={`h-5 w-5 ${
                        isWorkerVerified ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    {isWorkerVerified ? (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Not Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {isWorkerVerified ? 'Tier 2 Access' : 'Tier 1 Access'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your account and access key features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/contribute">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Contribute
                    </Button>
                  </Link>
                  <Link href="/withdrawals">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Request Withdrawal
                    </Button>
                  </Link>
                  <Link href="/withdrawals">
                    <Button variant="outline" className="w-full" size="lg">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Requests
                    </Button>
                  </Link>
                  {!isWorkerVerified && (
                    <Link href="/verify">
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50" size="lg">
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Identity
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="gooddollar">GoodDollar</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <WorkerProfile />
          </TabsContent>

          <TabsContent value="gooddollar" className="space-y-6">
            {/* GoodDollar Stats Display */}
            <GoodDollarStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClaimWidget
                environment={
                  process.env.NEXT_PUBLIC_GOODDOLLAR_ENV === "production"
                    ? "production"
                    : "development"
                }
                onClaimSuccess={(amount) => {
                  console.log("Claimed:", amount);
                }}
              />

              <Card>
                <CardHeader>
                  <CardTitle>About GoodDollar</CardTitle>
                  <CardDescription>
                    Supplement your income with Universal Basic Income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                      <h4 className="font-semibold mb-3 text-green-900">How it works</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Claim your daily GoodDollar UBI</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Build additional income stream</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Optional: Contribute to the pool</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Strengthen the mutual aid network</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <SelfProtocolVerifier
              onVerificationComplete={(verified) => setIsVerified(verified)}
            />

            {isVerified && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription>
                  <p className="font-semibold text-green-900 mb-1">Verification Complete!</p>
                  <p className="text-sm text-green-700">
                    You can now access Tier 2 withdrawal limits and fully participate in the Benefits Pool.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
