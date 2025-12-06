"use client";

import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Shield, DollarSign, TrendingUp } from "lucide-react";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { useWithdrawalLimits } from "@/hooks/useWithdrawalLimits";
import { formatTokenAmount } from "@/lib/token-utils";

export function WorkerProfile() {
  const account = useActiveAccount();
  const { workerInfo, isLoading } = useWorkerInfo(account?.address);
  const { limits } = useWithdrawalLimits(account?.address);

  if (!account) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your wallet to view your profile
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (!workerInfo?.isRegistered) {
    return (
      <Alert>
        <AlertDescription>
          You are not registered as a worker yet. Please register to view your profile.
        </AlertDescription>
      </Alert>
    );
  }

  const totalContributions = workerInfo.totalContributions
    ? formatTokenAmount(workerInfo.totalContributions)
    : "0";
  const withdrawalCount = workerInfo.withdrawalCount ? Number(workerInfo.withdrawalCount) : 0;
  const joinedDate = workerInfo.joinedAt
    ? new Date(Number(workerInfo.joinedAt) * 1000)
    : new Date();
  const lastContributionDate = workerInfo.lastContributionTime && Number(workerInfo.lastContributionTime) > 0
    ? new Date(Number(workerInfo.lastContributionTime) * 1000)
    : null;

  const tier1Limit = limits?.tier1Limit ? formatTokenAmount(limits.tier1Limit) : "0";
  const tier2Limit = limits?.tier2Limit ? formatTokenAmount(limits.tier2Limit) : "0";
  const currentLimit = workerInfo.isVerified ? tier2Limit : tier1Limit;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Worker Profile
                {workerInfo.isVerified && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your worker profile information (stored on-chain)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Wallet Address</Label>
              <p className="text-sm font-mono bg-gray-50 p-2 rounded mt-1">
                {account.address.slice(0, 10)}...{account.address.slice(-8)}
              </p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Registration Date</Label>
              <p className="text-sm mt-1 p-2">
                {joinedDate.toLocaleDateString()}
              </p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Gig Work Type</Label>
              <p className="text-sm mt-1 p-2">{workerInfo.gigWorkType || "Not specified"}</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Location</Label>
              <p className="text-sm mt-1 p-2">{workerInfo.location || "Not specified"}</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Years of Experience</Label>
              <p className="text-sm mt-1 p-2">{workerInfo.yearsExperience || 0} years</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Monthly Income</Label>
              <p className="text-sm mt-1 p-2">${workerInfo.monthlyIncome ? Number(workerInfo.monthlyIncome).toLocaleString() : "0"} USD</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Verification Status</Label>
              <div className="flex items-center gap-2 mt-1 p-2">
                {workerInfo.isVerified ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Verified</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Contribution Statistics
          </CardTitle>
          <CardDescription>Your participation in the benefits pool</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Total Contributions</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {totalContributions} cUSD
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Emergency Withdrawals</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {withdrawalCount}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-900">Withdrawal Limit</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {currentLimit} cUSD
              </p>
            </div>
          </div>

          {lastContributionDate && (
            <div className="mt-4">
              <Label className="text-sm text-gray-600">Last Contribution</Label>
              <p className="text-sm mt-1">
                {lastContributionDate.toLocaleDateString()} at {lastContributionDate.toLocaleTimeString()}
              </p>
            </div>
          )}

          {!lastContributionDate && (
            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-sm text-yellow-800">
                You haven't made any contributions yet. Start contributing to build your emergency fund!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Limits</CardTitle>
          <CardDescription>Your current emergency withdrawal eligibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-green-900">Tier 1 (No Verification)</p>
                {!workerInfo.isVerified && (
                  <Badge variant="default" className="bg-green-600">Active</Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-green-600 mb-1">
                {tier1Limit} cUSD
              </p>
              <p className="text-xs text-green-700">
                100% of your contributions - Your money, always accessible
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              workerInfo.isVerified
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-semibold ${
                  workerInfo.isVerified ? 'text-blue-900' : 'text-gray-600'
                }`}>
                  Tier 2 (Verification Required)
                </p>
                {workerInfo.isVerified && (
                  <Badge variant="default" className="bg-blue-600">Active</Badge>
                )}
              </div>
              <p className={`text-2xl font-bold mb-1 ${
                workerInfo.isVerified ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {tier2Limit} cUSD
              </p>
              <p className={`text-xs ${
                workerInfo.isVerified ? 'text-blue-700' : 'text-gray-500'
              }`}>
                200% of your contributions - Community assistance during emergencies
              </p>
            </div>
          </div>

          {!workerInfo.isVerified && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                💡 Verify your identity to unlock Tier 2 limits and access up to 200% of your contributions during emergencies.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
