"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Lock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDisplayAmount } from "@/lib/token-utils";

interface WithdrawalLimitsDisplayProps {
  totalContributions: number;
  isVerified: boolean;
  showVerifyButton?: boolean;
  compact?: boolean;
}

export function WithdrawalLimitsDisplay({
  totalContributions,
  isVerified,
  showVerifyButton = true,
  compact = false,
}: WithdrawalLimitsDisplayProps) {
  const router = useRouter();

  const tier1Limit = totalContributions; // 100%
  const tier2Limit = totalContributions * 2; // 200%

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Tier 1 Limit</p>
            <p className="text-2xl font-bold text-green-600">{formatDisplayAmount(tier1Limit)} cUSD</p>
            <p className="text-xs text-gray-500">No verification needed</p>
          </div>
          {isVerified ? (
            <div>
              <p className="text-sm font-medium">Tier 2 Limit</p>
              <p className="text-2xl font-bold text-blue-600">{formatDisplayAmount(tier2Limit)} cUSD</p>
              <p className="text-xs text-green-600">✓ Verified</p>
            </div>
          ) : (
            <div className="opacity-60">
              <p className="text-sm font-medium">Tier 2 Limit</p>
              <p className="text-2xl font-bold text-gray-400">{formatDisplayAmount(tier2Limit)} cUSD</p>
              <p className="text-xs text-gray-500">🔒 Locked</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Withdrawal Limits</CardTitle>
        <CardDescription>
          Based on your total contributions of {formatDisplayAmount(totalContributions)} cUSD
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tier 1 */}
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">Tier 1: Your Money</h3>
                <Badge className="bg-green-600 text-white">No Verification</Badge>
              </div>
              <p className="text-sm text-gray-600">Access your own contributions</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>

          <div className="mt-3">
            <p className="text-3xl font-bold text-green-700">{formatDisplayAmount(tier1Limit)} cUSD</p>
            <p className="text-sm text-gray-600 mt-1">
              = 100% of your contributions
            </p>
          </div>

          <div className="mt-3 bg-white rounded p-3 text-sm">
            <p className="font-medium mb-1">What you can do:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Request withdrawals up to {formatDisplayAmount(tier1Limit)} cUSD</li>
              <li>No identity verification required</li>
              <li>It&apos;s your money - fast access</li>
            </ul>
          </div>
        </div>

        {/* Tier 2 */}
        <div className={`border-2 rounded-lg p-4 ${
          isVerified
            ? "border-blue-200 bg-blue-50"
            : "border-gray-200 bg-gray-50 opacity-75"
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">Tier 2: Community Assistance</h3>
                {isVerified ? (
                  <Badge className="bg-blue-600 text-white">✓ Verified</Badge>
                ) : (
                  <Badge variant="outline">Verification Required</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Access community funds for emergencies
              </p>
            </div>
            {isVerified ? (
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            ) : (
              <Lock className="w-6 h-6 text-gray-400" />
            )}
          </div>

          <div className="mt-3">
            <p className={`text-3xl font-bold ${
              isVerified ? "text-blue-700" : "text-gray-400"
            }`}>
              {formatDisplayAmount(tier2Limit)} cUSD
            </p>
            <p className="text-sm text-gray-600 mt-1">
              = 200% of your contributions
            </p>
          </div>

          <div className="mt-3 bg-white rounded p-3 text-sm">
            {isVerified ? (
              <>
                <p className="font-medium mb-1 text-green-700">✓ Unlocked</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Request up to {formatDisplayAmount(tier2Limit)} cUSD</li>
                  <li>Access community mutual aid funds</li>
                  <li>Identity verified for security</li>
                </ul>
              </>
            ) : (
              <>
                <p className="font-medium mb-1 text-gray-700">🔒 Locked - Verification Needed</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Verify identity to unlock</li>
                  <li>Withdraw more during emergencies</li>
                  <li>Get community support when needed</li>
                </ul>
              </>
            )}
          </div>

          {!isVerified && showVerifyButton && (
            <Button
              onClick={() => router.push('/verify')}
              className="w-full mt-3"
              variant="default"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Verify Identity to Unlock Tier 2
            </Button>
          )}
        </div>

        {/* Summary */}
        {totalContributions === 0 && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-sm">
              <p className="font-semibold mb-1">💡 Start Contributing!</p>
              <p>Make your first contribution to unlock withdrawal capabilities. The more you contribute, the higher your limits.</p>
            </AlertDescription>
          </Alert>
        )}

        {!isVerified && totalContributions > 0 && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm">
              <p className="font-semibold mb-1">💡 Optional Verification</p>
              <p>You can already withdraw up to {formatDisplayAmount(tier1Limit)} cUSD without verification. Verify to unlock Tier 2 for emergencies requiring more support.</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
