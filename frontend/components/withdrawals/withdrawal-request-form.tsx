"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { WithdrawalLimitsDisplay } from "./withdrawal-limits-display";
import { useRouter } from "next/navigation";

export function WithdrawalRequestForm() {
  const account = useActiveAccount();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Mock data - TODO: Replace with actual data from smart contract
  const totalContributions = 120.5;
  const isVerified = false; // TODO: Get from user state/contract

  // Tiered withdrawal limits
  const tier1Limit = totalContributions; // 100% - your contributions (no verification)
  const tier2Limit = totalContributions * 2; // 200% - community assistance (verification required)
  const currentMaxWithdrawal = isVerified ? tier2Limit : tier1Limit;

  // Smart alert based on amount
  const getWithdrawalAlert = () => {
    const withdrawalAmount = parseFloat(amount);
    if (!amount || isNaN(withdrawalAmount)) return null;

    // Amount exceeds absolute maximum (200%)
    if (withdrawalAmount > tier2Limit) {
      return {
        variant: "destructive" as const,
        icon: AlertCircle,
        title: "Amount Too High",
        message: `Maximum withdrawal is ${tier2Limit.toFixed(2)} cUSD (200% of your contributions). Please reduce the amount.`,
      };
    }

    // Amount requires verification (between 100% and 200%)
    if (withdrawalAmount > tier1Limit && !isVerified) {
      return {
        variant: "warning" as const,
        icon: AlertTriangle,
        title: "Verification Required",
        message: `To withdraw more than ${tier1Limit.toFixed(2)} cUSD, you need to verify your identity. This allows access to community assistance funds.`,
        showVerifyButton: true,
      };
    }

    // Amount is within verified limit (accessing community funds)
    if (withdrawalAmount > tier1Limit && isVerified) {
      return {
        variant: "info" as const,
        icon: Info,
        title: "Using Community Assistance",
        message: `You're requesting ${(withdrawalAmount - tier1Limit).toFixed(2)} cUSD from community funds (beyond your ${tier1Limit.toFixed(2)} cUSD contributions).`,
      };
    }

    // Amount is within Tier 1 (your own contributions)
    if (withdrawalAmount <= tier1Limit) {
      return {
        variant: "success" as const,
        icon: CheckCircle2,
        title: "No Verification Needed",
        message: `You're withdrawing from your own contributions. No verification required!`,
      };
    }

    return null;
  };

  const alert = getWithdrawalAlert();

  const handleSubmit = async () => {
    if (!account) return;

    const withdrawalAmount = parseFloat(amount);

    // Validate against tiered limits
    if (withdrawalAmount > currentMaxWithdrawal) {
      if (!isVerified && withdrawalAmount <= tier2Limit) {
        setErrorMessage(`Please verify your identity to withdraw up to ${tier2Limit.toFixed(2)} cUSD. Current limit: ${tier1Limit.toFixed(2)} cUSD`);
      } else {
        setErrorMessage(`Maximum withdrawal is ${tier2Limit.toFixed(2)} cUSD (200% of contributions)`);
      }
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // TODO: Call smart contract to create withdrawal request
      // const contract = getBenefitsPoolContract();
      // const transaction = prepareContractCall({
      //   contract,
      //   method: "requestWithdrawal",
      //   params: [amount, reason],
      // });
      // const result = await sendTransaction(transaction);

      // Simulate request creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Record in database
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account.address,
          amount: withdrawalAmount,
          reason,
          urgencyLevel: urgency,
          requestId: Math.floor(Math.random() * 10000), // Mock request ID
          txHash: `0x${Math.random().toString(16).slice(2)}`,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          setAmount("");
          setReason("");
          setUrgency("MEDIUM");
        }, 3000);
      } else {
        throw new Error("Failed to create withdrawal request");
      }
    } catch (error) {
      console.error("Withdrawal request failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Request failed"
      );
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your wallet to request emergency withdrawals
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Withdrawal Limits Display */}
      <WithdrawalLimitsDisplay
        totalContributions={totalContributions}
        isVerified={isVerified}
        showVerifyButton={true}
        compact={false}
      />

      <Card>
        <CardHeader>
          <CardTitle>Emergency Withdrawal Request</CardTitle>
          <CardDescription>
            Request emergency funds from the pool (requires community approval)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

        <div className="space-y-2">
          <Label htmlFor="amount">Withdrawal Amount (cUSD)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            max={tier2Limit}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            placeholder={`Max: ${currentMaxWithdrawal.toFixed(2)} cUSD`}
          />
          <p className="text-sm text-gray-600">
            Current limit: {currentMaxWithdrawal.toFixed(2)} cUSD
            {!isVerified && ` (verify to unlock ${tier2Limit.toFixed(2)} cUSD)`}
          </p>
        </div>

        {/* Smart Contextual Alert */}
        {alert && (
          <Alert className={
            alert.variant === "success" ? "bg-green-50 border-green-200" :
            alert.variant === "warning" ? "bg-yellow-50 border-yellow-200" :
            alert.variant === "info" ? "bg-blue-50 border-blue-200" :
            "bg-red-50 border-red-200"
          }>
            <alert.icon className={`h-4 w-4 ${
              alert.variant === "success" ? "text-green-600" :
              alert.variant === "warning" ? "text-yellow-600" :
              alert.variant === "info" ? "text-blue-600" :
              "text-red-600"
            }`} />
            <AlertDescription>
              <p className="font-semibold mb-1">{alert.title}</p>
              <p className="text-sm">{alert.message}</p>
              {alert.showVerifyButton && (
                <Button
                  onClick={() => router.push('/verify')}
                  size="sm"
                  className="mt-3"
                  variant="default"
                >
                  Verify Identity Now
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select value={urgency} onValueChange={setUrgency} disabled={isSubmitting}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low - Can wait a few weeks</SelectItem>
              <SelectItem value="MEDIUM">Medium - Needed within a week</SelectItem>
              <SelectItem value="HIGH">High - Urgent, needed ASAP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Emergency Withdrawal</Label>
          <Textarea
            id="reason"
            rows={4}
            placeholder="Please explain your emergency situation (e.g., medical emergency, car repair, urgent bill)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-600">
            Your fellow workers will review and vote on your request
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold">Withdrawal Process</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Your request will be open for community voting (7 days)</li>
            <li>• Requires 60% approval from verified workers</li>
            <li>• Funds will be transferred automatically if approved</li>
            <li>• 90-day cooldown between withdrawal requests</li>
          </ul>
        </div>

        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Request submitted! The community will vote on your request.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !amount ||
            !reason ||
            parseFloat(amount) > currentMaxWithdrawal ||
            parseFloat(amount) <= 0
          }
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            "Submit Emergency Withdrawal Request"
          )}
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}
