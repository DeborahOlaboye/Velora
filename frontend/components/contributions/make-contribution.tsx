"use client";

import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
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

    const contributionAmount = parseFloat(amount);
    if (contributionAmount < 5) {
      setErrorMessage("Minimum contribution is 5 cUSD");
      setStatus("error");
      return;
    }

    const amountInWei = parseTokenAmount(amount);

    // Check balance before approval
    if (cUSDBalance && amountInWei > cUSDBalance) {
      setErrorMessage(`Insufficient cUSD balance. You have ${formatTokenAmount(cUSDBalance)} cUSD but trying to contribute ${amount} cUSD`);
      setStatus("error");
      return;
    }

    setIsApproving(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const approveTransaction = prepareApproveTransaction(amountInWei);

      await sendTransaction(approveTransaction);

      // Refetch allowance
      await refetchAllowance();

      setCurrentStep("contribute");
      setStatus("idle");
    } catch (error) {
      console.error("Approval failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Approval failed. Please try again."
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
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to make contributions to the pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-800">
              You need to connect your wallet and be registered to make contributions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Contribution Details</CardTitle>
        <CardDescription className="text-base">
          Contribute to build your emergency fund (minimum 5 cUSD)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Contribution Amount (cUSD)</Label>
          <Input
            id="amount"
            type="number"
            min="5"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting || isApproving}
            className="h-12 text-lg font-semibold"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Minimum: 5 cUSD</span>
            {cUSDBalance !== undefined && (
              <span className={`font-medium ${
                cUSDBalance === 0n ? 'text-red-600' :
                parseFloat(amount) > 0 && parseTokenAmount(amount) > cUSDBalance ? 'text-red-600' :
                'text-blue-600'
              }`}>
                Balance: {formatTokenAmount(cUSDBalance)} cUSD
              </span>
            )}
          </div>
        </div>

        {/* Insufficient Balance Warning */}
        {cUSDBalance !== undefined && parseFloat(amount) > 0 && parseTokenAmount(amount) > cUSDBalance && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">
              Insufficient cUSD balance! You have {formatTokenAmount(cUSDBalance)} cUSD but trying to contribute {amount} cUSD.
              {cUSDBalance === 0n && (
                <p className="mt-2 text-sm">
                  You need to get some cUSD tokens first. You can swap other tokens for cUSD on a DEX like Ubeswap.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Zero Balance Warning */}
        {cUSDBalance === 0n && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <p className="font-semibold mb-1">No cUSD Balance Detected</p>
              <p className="text-sm">
                You need cUSD tokens to contribute. Get cUSD from:
              </p>
              <ul className="text-sm mt-2 space-y-1 ml-4 list-disc">
                <li>Swap tokens on <a href="https://app.ubeswap.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ubeswap</a></li>
                <li>Bridge from other chains using <a href="https://www.portalbridge.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portal Bridge</a></li>
                <li>Buy directly on an exchange and withdraw to Celo</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Benefits Info */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 space-y-3">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            What You Get
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span><strong>Tier 1 Access:</strong> Withdraw up to 100% of contributions anytime (no verification)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span><strong>Tier 2 Access:</strong> Withdraw up to 200% with verification (community support)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span>Voting rights on all withdrawal requests</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span>Help build a safety net for fellow gig workers</span>
            </li>
          </ul>
        </div>

        {/* Success Message */}
        {status === "success" && (
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-700 font-medium">
              Contribution successful! Your emergency fund has been updated.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {status === "error" && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-700 font-medium">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        {currentStep === "approve" && (
          <div className="space-y-3">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-sm text-yellow-800">
                <strong>Step 1 of 2:</strong> You need to approve the cUSD spending limit before contributing.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleApprove}
              disabled={isApproving || parseFloat(amount) < 5}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              size="lg"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Approving cUSD...
                </>
              ) : (
                `Approve ${amount} cUSD Spending`
              )}
            </Button>
          </div>
        )}

        {currentStep === "contribute" && (
          <Button
            onClick={handleContribute}
            disabled={isSubmitting || parseFloat(amount) < 5}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Contribution...
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
