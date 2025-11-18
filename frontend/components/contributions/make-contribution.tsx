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
import { getBenefitsPoolContract } from "@/lib/gasless";

export function MakeContribution() {
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const [amount, setAmount] = useState("5.00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleContribute = async () => {
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

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // TODO: Replace with actual smart contract interaction
      // const contract = getBenefitsPoolContract();
      // const transaction = prepareContractCall({
      //   contract,
      //   method: "contribute",
      //   params: [amount],
      // });
      // const result = await sendTransaction(transaction);

      // Simulate contribution
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Record in database
      await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account.address,
          amount: contributionAmount,
          txHash: `0x${Math.random().toString(16).slice(2)}`, // Mock tx hash
          blockNumber: Math.floor(Math.random() * 1000000),
          contributionType: "MONTHLY",
        }),
      });

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
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-600">
            Your contribution helps build emergency funds for all workers
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold">Contribution Benefits</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Eligible for emergency withdrawals (up to 50% of contributions)</li>
            <li>• Voting rights on withdrawal requests</li>
            <li>• Build a safety net with fellow gig workers</li>
            <li>• Gas-less transactions with thirdweb</li>
          </ul>
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
      </CardContent>
    </Card>
  );
}
