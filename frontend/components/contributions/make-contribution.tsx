"use client";

import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { prepareContractCall } from "thirdweb";
import { getBenefitsPoolContract } from "@/lib/contracts";
import { useCUSDBalance } from "@/hooks/useCUSDBalance";
import { useCUSDAllowance } from "@/hooks/useCUSDAllowance";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { parseTokenAmount, formatTokenAmount, needsApproval, prepareApproveTransaction } from "@/lib/token-utils";

export function MakeContribution() {
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { balance: cUSDBalance, refetch: refetchBalance } = useCUSDBalance(account?.address);
  const { allowance: cUSDAllowance, refetch: refetchAllowance } = useCUSDAllowance(account?.address);
  const { workerInfo, refetch: refetchWorkerInfo } = useWorkerInfo(account?.address);
  const [amount, setAmount] = useState("5.00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<"approve" | "contribute">("contribute");

  const handleApprove = async () => {
    if (!account) {
      setErrorMessage("Please connect your wallet");
      setStatus("error");
      return;
    }

    setIsApproving(true);
    setStatus("idle");

    try {
      const amountInWei = parseTokenAmount(amount);
      const approveTransaction = prepareApproveTransaction(amountInWei);

      await sendTransaction(approveTransaction);

      // Refetch allowance
      await refetchAllowance();

      setCurrentStep("contribute");
    } catch (error) {
      console.error("Approval failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Approval failed"
      );
      setStatus("error");
    } finally {
      setIsApproving(false);
    }
  };

  const handleContribute = async () => {
    if (!account) {
      setErrorMessage("Please connect your wallet");
      setStatus("error");
      return;
    }

    // Check if user is registered
    if (!workerInfo?.isRegistered) {
      setErrorMessage("You must register as a worker first");
      setStatus("error");
      return;
    }

    const contributionAmount = parseFloat(amount);
    if (contributionAmount < 5) {
      setErrorMessage("Minimum contribution is 5 cUSD");
      setStatus("error");
      return;
    }

    const amountInWei = parseTokenAmount(amount);

    // Check balance
    if (cUSDBalance && amountInWei > cUSDBalance) {
      setErrorMessage("Insufficient cUSD balance");
      setStatus("error");
      return;
    }

    // Check if approval is needed
    if (needsApproval(amountInWei, cUSDAllowance)) {
      setCurrentStep("approve");
      setErrorMessage("Please approve cUSD spending first");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // Prepare contract call to contribute()
      const contract = getBenefitsPoolContract();
      const transaction = prepareContractCall({
        contract,
        method: "function contribute(uint256 _amount)",
        params: [amountInWei],
      });

      // Send transaction
      const result = await sendTransaction(transaction);
      console.log("Contribution transaction sent:", result);

      // Record in database
      await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account.address,
          amount: contributionAmount,
          txHash: result.transactionHash,
          blockNumber: 0, // Will be updated by backend
          contributionType: "MONTHLY",
        }),
      });

      // Refetch balances and worker info
      await Promise.all([refetchBalance(), refetchAllowance(), refetchWorkerInfo()]);

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setAmount("5.00");
      }, 3000);
    } catch (error) {
      console.error("Contribution failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Contribution failed"
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
          Please connect your wallet to make contributions
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Contribution</CardTitle>
        <CardDescription>
          Contribute to the mutual aid pool (minimum 5 cUSD)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Contribution Amount (cUSD)</Label>
          <Input
            id="amount"
            type="number"
            min="5"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting || isApproving}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Your contribution helps build emergency funds for all workers</span>
            {cUSDBalance !== undefined && (
              <span>Balance: {formatTokenAmount(cUSDBalance)} cUSD</span>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold">Contribution Benefits</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Tier 1: Withdraw up to 100% of your contributions (no verification)</li>
            <li>• Tier 2: Withdraw up to 200% with verification (community assistance)</li>
            <li>• Voting rights on withdrawal requests</li>
            <li>• Build a safety net with fellow gig workers</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2 italic">
            💡 No verification needed to contribute or withdraw your own funds!
          </p>
        </div>

        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Contribution successful! Thank you for supporting the pool.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {currentStep === "approve" && (
          <Button
            onClick={handleApprove}
            disabled={isApproving || parseFloat(amount) < 5}
            className="w-full"
            size="lg"
          >
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              `Approve ${amount} cUSD`
            )}
          </Button>
        )}

        {currentStep === "contribute" && (
          <Button
            onClick={handleContribute}
            disabled={isSubmitting || parseFloat(amount) < 5}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Contribute ${amount} cUSD`
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
