"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Gift, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import {
  canClaimGoodDollar,
  getGoodDollarBalance,
  recordGoodDollarClaim,
  convertGDollarToCUSD,
} from "@/lib/gooddollar";

interface EnhancedClaimWidgetProps {
  onClaimSuccess?: (amount: string, autoContributed: boolean) => void;
  network?: "celo" | "fuse";
}

export function EnhancedClaimWidget({
  onClaimSuccess,
  network = "celo",
}: EnhancedClaimWidgetProps) {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<{
    canClaim: boolean;
    nextClaimTime?: Date;
    claimAmount?: string;
  }>({ canClaim: false });
  const [balance, setBalance] = useState("0");
  const [autoContribute, setAutoContribute] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check claim status
  useEffect(() => {
    if (!account?.address) return;

    const checkStatus = async () => {
      setLoading(true);
      try {
        const [status, bal] = await Promise.all([
          canClaimGoodDollar(account.address, network),
          getGoodDollarBalance(account.address, network),
        ]);
        setClaimStatus(status);
        setBalance(bal);
      } catch (err) {
        console.error("Error checking claim status:", err);
        setError("Failed to check claim status");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    // Refresh every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [account?.address, network]);

  const handleClaim = async () => {
    if (!account?.address) return;

    setClaiming(true);
    setError("");
    setSuccess("");

    try {
      // In a real implementation, this would interact with the GoodDollar contract
      // For now, we'll simulate the claim
      
      // TODO: Implement actual GoodDollar claim transaction
      // const tx = await claimGoodDollar(account.address, network);
      // await tx.wait();
      
      // Simulate claim
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const claimedAmount = claimStatus.claimAmount || "0";
      const txHash = "0x" + Math.random().toString(16).substring(2); // Simulated

      // Record the claim
      await recordGoodDollarClaim(
        account.address,
        claimedAmount,
        txHash,
        autoContribute
      );

      setSuccess(
        `Successfully claimed ${claimedAmount} G$${
          autoContribute ? " and contributed to the pool!" : "!"
        }`
      );

      // Refresh status
      const [status, bal] = await Promise.all([
        canClaimGoodDollar(account.address, network),
        getGoodDollarBalance(account.address, network),
      ]);
      setClaimStatus(status);
      setBalance(bal);

      onClaimSuccess?.(claimedAmount, autoContribute);
    } catch (err) {
      console.error("Claim error:", err);
      setError(err instanceof Error ? err.message : "Failed to claim GoodDollar");
    } finally {
      setClaiming(false);
    }
  };

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Claim GoodDollar UBI</CardTitle>
          <CardDescription>
            Connect your wallet to claim your daily Universal Basic Income
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please connect your wallet to access GoodDollar claiming
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Claim GoodDollar UBI
        </CardTitle>
        <CardDescription>
          Claim your daily Universal Basic Income and support the mutual aid pool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Your G$ Balance</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              `${parseFloat(balance).toFixed(2)} G$`
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ≈ ${convertGDollarToCUSD(balance)} cUSD
          </div>
        </div>

        {/* Claim Status */}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {claimStatus.canClaim ? (
              <div className="space-y-4">
                {/* Claimable Amount */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-700 font-medium">
                        Available to Claim
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {claimStatus.claimAmount} G$
                      </div>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                {/* Auto-Contribute Option */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Checkbox
                    id="auto-contribute"
                    checked={autoContribute}
                    onCheckedChange={(checked) => setAutoContribute(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="auto-contribute"
                      className="text-sm font-medium text-blue-900 cursor-pointer"
                    >
                      Auto-contribute to Benefits Pool
                    </Label>
                    <p className="text-xs text-blue-700 mt-1">
                      Automatically contribute your claimed G$ to help fellow gig workers.
                      Your contribution will be converted to cUSD and added to the pool.
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                </div>

                {/* Claim Button */}
                <Button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full"
                  size="lg"
                >
                  {claiming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Claim {claimStatus.claimAmount} G$
                      {autoContribute && " & Contribute"}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <div className="text-sm font-medium text-gray-700 mb-1">
                  No Claims Available
                </div>
                {claimStatus.nextClaimTime && (
                  <div className="text-xs text-gray-500">
                    Next claim available:{" "}
                    {claimStatus.nextClaimTime.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Information */}
        <div className="text-xs text-gray-600 space-y-2 pt-4 border-t">
          <p className="font-semibold">About GoodDollar UBI:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Claim free G$ tokens daily as Universal Basic Income</li>
            <li>Requires face verification for new users</li>
            <li>Available on Celo and Fuse networks</li>
            <li>Help build financial resilience for gig workers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
