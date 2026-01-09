"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Percent } from "lucide-react";

interface QuickStatsProps {
  totalContributed: number;
  totalWithdrawn: number;
  withdrawalLimit: number;
  votingPower: number;
  isLoading?: boolean;
}

export function QuickStats({
  totalContributed,
  totalWithdrawn,
  withdrawalLimit,
  votingPower,
  isLoading = false,
}: QuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const netPosition = totalContributed - totalWithdrawn;
  const utilizationRate = totalContributed > 0 
    ? (totalWithdrawn / totalContributed) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Contributed */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Total Contributed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {totalContributed.toFixed(2)} cUSD
          </div>
          <p className="text-xs text-gray-500 mt-1">All-time contributions</p>
        </CardContent>
      </Card>

      {/* Total Withdrawn */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-purple-500" />
            Total Withdrawn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {totalWithdrawn.toFixed(2)} cUSD
          </div>
          <p className="text-xs text-gray-500 mt-1">Emergency withdrawals</p>
        </CardContent>
      </Card>

      {/* Net Position */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <Percent className="h-4 w-4 text-blue-500" />
            Net Position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            netPosition >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {netPosition >= 0 ? '+' : ''}{netPosition.toFixed(2)} cUSD
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {netPosition >= 0 ? 'Contributed more than withdrawn' : 'Withdrawn more than contributed'}
          </p>
        </CardContent>
      </Card>

      {/* Voting Power */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            Voting Power
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {votingPower.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {withdrawalLimit.toFixed(0)} cUSD withdrawal limit
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
