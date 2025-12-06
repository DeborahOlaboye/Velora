"use client";

import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
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
import { prepareContractCall } from "thirdweb";
import { getBenefitsPoolContract } from "@/lib/contracts";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { useWithdrawalLimits } from "@/hooks/useWithdrawalLimits";
import { parseTokenAmount, formatTokenAmount } from "@/lib/token-utils";

export function WithdrawalRequestForm() {
  const account = useActiveAccount();
  const router = useRouter();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { workerInfo, refetch: refetchWorkerInfo } = useWorkerInfo(account?.address);
  const { limits, refetch: refetchLimits } = useWithdrawalLimits(account?.address);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Get data from contract
  const totalContributions = workerInfo?.totalContributions ? Number(formatTokenAmount(workerInfo.totalContributions)) : 0;
  const isVerified = workerInfo?.isVerified || false;

  // Tiered withdrawal limits from contract
  const tier1Limit = limits?.tier1Limit ? Number(formatTokenAmount(limits.tier1Limit)) : totalContributions;
  const tier2Limit = limits?.tier2Limit ? Number(formatTokenAmount(limits.tier2Limit)) : totalContributions * 2;
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

    // Check if user is registered
    if (!workerInfo?.isRegistered) {
      setErrorMessage("You must register as a worker first");
      setStatus("error");
      return;
    }

    const withdrawalAmount = parseFloat(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setErrorMessage("Please enter a valid amount");
      setStatus("error");
      return;
    }

    if (!reason.trim()) {
      setErrorMessage("Please provide a reason for your withdrawal request");
      setStatus("error");
      return;
    }

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
    setErrorMessage("");

    try {
      // Convert amount to wei
      const amountInWei = parseTokenAmount(amount);

      // Prepare contract call to requestWithdrawal()
      const contract = getBenefitsPoolContract();
      const transaction = prepareContractCall({
        contract,
        method: "function requestWithdrawal(uint256 _amount, string _reason) returns (uint256)",
        params: [amountInWei, reason],
      });

      // Send transaction
      const result = await sendTransaction(transaction);
      console.log("Withdrawal request transaction sent:", result);

      // Refetch worker info to update the UI
      await refetchWorkerInfo();
      await refetchLimits();

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setAmount("");
        setReason("");
        setUrgency("MEDIUM");
      }, 3000);
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
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to request emergency withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-purple-50 border-purple-200">
            <AlertDescription className="text-sm text-purple-800">
              You need to connect your wallet and be registered to request withdrawals.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Request Emergency Withdrawal</CardTitle>
          <CardDescription className="text-base">
            Access your contributions or request community assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Withdrawal Amount (cUSD)</Label>
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
            className="h-12 text-lg font-semibold"
          />
          <p className="text-sm text-gray-600">
            Your limit: <strong>{currentMaxWithdrawal.toFixed(2)} cUSD</strong>
            {!isVerified && ` • Verify to unlock ${tier2Limit.toFixed(2)} cUSD`}
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
          <Label htmlFor="urgency" className="text-sm font-medium">Urgency Level</Label>
          <Select value={urgency} onValueChange={setUrgency} disabled={isSubmitting}>
            <SelectTrigger className="h-11">
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
          <Label htmlFor="reason" className="text-sm font-medium">Reason for Emergency Withdrawal</Label>
          <Textarea
            id="reason"
            rows={4}
            placeholder="Please explain your emergency situation (e.g., medical emergency, car repair, urgent bill)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            className="resize-none"
          />
          <p className="text-sm text-gray-600">
            Your fellow workers will review and vote on your request
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 space-y-3">
          <h4 className="font-semibold text-yellow-900 flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-600" />
            Withdrawal Process
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0" />
              <span>Your request will be open for community voting (7 days)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0" />
              <span>Requires 60% approval from verified workers</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0" />
              <span>Funds transferred automatically if approved</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0" />
              <span>90-day cooldown between withdrawal requests</span>
            </li>
          </ul>
        </div>

        {status === "success" && (
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              Request submitted successfully! The community will vote on your request.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">
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
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting to Blockchain...
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
