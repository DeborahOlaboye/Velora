"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, FileText, Loader2 } from "lucide-react";
import { usePoolStats } from "@/hooks/usePoolStats";
import { formatTokenAmount } from "@/lib/token-utils";

export function PoolStats() {
  const { poolStats, isLoading } = usePoolStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  const totalBalance = poolStats?.balance ? formatTokenAmount(poolStats.balance) : "0";
  const totalWorkers = poolStats?.workersCount ? poolStats.workersCount.toString() : "0";
  const activeRequests = poolStats?.activeRequests ? poolStats.activeRequests.toString() : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pool Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBalance} cUSD</div>
          <p className="text-xs text-muted-foreground">
            Available for emergency withdrawals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWorkers}</div>
          <p className="text-xs text-muted-foreground">
            Registered gig workers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeRequests}</div>
          <p className="text-xs text-muted-foreground">
            Pending withdrawal requests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
