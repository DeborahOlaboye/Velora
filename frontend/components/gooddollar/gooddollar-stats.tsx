"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGoodDollarStats } from "@/hooks/useGoodDollarStats";
import { DollarSign, TrendingUp, Calendar, Zap, Loader2 } from "lucide-react";
import { formatDisplayAmount } from "@/lib/token-utils";

export function GoodDollarStats() {
  const { stats, isLoading, error } = useGoodDollarStats();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <DollarSign className="h-5 w-5 text-green-600" />
            GoodDollar Impact
          </CardTitle>
          <CardDescription>Start claiming to see your stats</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Connect your wallet and claim GoodDollar UBI to see your impact here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { totalClaimed, claimCount, claimStreak, canClaimToday, equivalentCUSD, nextClaimTime } = stats;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-green-900">GoodDollar Impact</CardTitle>
              <CardDescription>Your UBI contribution stats</CardDescription>
            </div>
          </div>
          {canClaimToday ? (
            <Badge className="bg-green-600 hover:bg-green-700">✨ Ready to Claim</Badge>
          ) : (
            <Badge variant="outline" className="border-green-600 text-green-700">
              Next claim available
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Claimed */}
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-gray-600 font-medium">Total Claimed</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatDisplayAmount(parseFloat(totalClaimed))}
            </p>
            <p className="text-xs text-gray-500 mt-1">G$ tokens</p>
          </div>

          {/* Claim Streak */}
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <p className="text-xs text-gray-600 font-medium">Claim Streak</p>
            </div>
            <p className="text-2xl font-bold text-orange-500">
              {claimStreak > 0 ? `🔥 ${claimStreak}` : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {claimStreak === 1 ? "day" : "days"}
            </p>
          </div>

          {/* Total Claims */}
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-gray-600 font-medium">Total Claims</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{claimCount}</p>
            <p className="text-xs text-gray-500 mt-1">lifetime</p>
          </div>

          {/* cUSD Equivalent */}
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-gray-600 font-medium">≈ Value</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatDisplayAmount(parseFloat(equivalentCUSD))}
            </p>
            <p className="text-xs text-gray-500 mt-1">cUSD</p>
          </div>
        </div>

        {/* Next Claim Timer */}
        {!canClaimToday && nextClaimTime && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-semibold text-yellow-900">Next Claim Available</p>
            </div>
            <p className="text-sm text-yellow-800">
              {new Date(nextClaimTime).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        {/* Streak Motivation */}
        {claimStreak >= 3 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-orange-900 mb-1">
              🔥 Amazing Streak!
            </p>
            <p className="text-xs text-orange-800">
              You&apos;ve claimed for {claimStreak} consecutive days. Keep it up to maximize your impact!
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-900 font-semibold mb-2">💡 Pro Tip:</p>
          <p className="text-xs text-blue-800">
            Enable auto-contribute below to automatically add your claimed G$ to your emergency
            fund. Build your safety net while supporting the community!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
