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
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function WithdrawalRequestForm() {
  const account = useActiveAccount();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Mock data - replace with actual from smart contract
  const totalContributions = 120.5;
  const maxWithdrawal = totalContributions * 0.5;

  const handleSubmit = async () => {
    if (!account) return;

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount > maxWithdrawal) {
      setErrorMessage(`Maximum withdrawal is ${maxWithdrawal.toFixed(2)} cUSD (50% of contributions)`);
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
    <Card>
      <CardHeader>
        <CardTitle>Emergency Withdrawal Request</CardTitle>
        <CardDescription>
          Request emergency funds from the pool (requires community approval)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Your eligibility:</strong> You can request up to{" "}
            <strong>{maxWithdrawal.toFixed(2)} cUSD</strong> (50% of your total
            contributions of {totalContributions.toFixed(2)} cUSD)
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="amount">Withdrawal Amount (cUSD)</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            max={maxWithdrawal}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

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
            parseFloat(amount) > maxWithdrawal ||
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
  );
}
