"use client";

import { useState, useEffect } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { prepareContractCall } from "thirdweb";
import { getBenefitsPoolContract } from "@/lib/contracts";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { usePoolStats } from "@/hooks/usePoolStats";
import { useWithdrawalRequest } from "@/hooks/useWithdrawalRequest";
import { useHasVoted } from "@/hooks/useHasVoted";
import { formatTokenAmount } from "@/lib/token-utils";

export function ActiveRequests() {
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { workerInfo } = useWorkerInfo(account?.address);
  const { poolStats } = usePoolStats();
  const [isVoting, setIsVoting] = useState<{ [key: number]: boolean }>({});
  const [isExecuting, setIsExecuting] = useState<{ [key: number]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState("");

  // Get total number of requests
  const totalRequests = poolStats?.activeRequests ? Number(poolStats.activeRequests) : 0;

  // Fetch all active requests (simplified - fetches last 10)
  const [activeRequestIds, setActiveRequestIds] = useState<number[]>([]);

  useEffect(() => {
    if (totalRequests > 0) {
      // Get the last 10 request IDs
      const ids = Array.from(
        { length: Math.min(totalRequests, 10) },
        (_, i) => Math.max(0, totalRequests - 10 + i)
      );
      setActiveRequestIds(ids);
    }
  }, [totalRequests]);

  const handleVote = async (requestId: number, support: boolean) => {
    if (!account) {
      setErrorMessage("Please connect your wallet");
      return;
    }

    if (!workerInfo?.isVerified) {
      setErrorMessage("Only verified workers can vote on withdrawal requests");
      return;
    }

    setIsVoting({ ...isVoting, [requestId]: true });
    setErrorMessage("");

    try {
      const contract = getBenefitsPoolContract();
      const transaction = prepareContractCall({
        contract,
        method: "function voteOnWithdrawal(uint256 _requestId, bool _support)",
        params: [BigInt(requestId), support],
      });

      await sendTransaction(transaction);
      console.log(`Voted ${support ? "for" : "against"} request ${requestId}`);

      // Record in database
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account.address,
          withdrawalId: requestId.toString(),
          support,
          txHash: "pending",
        }),
      });
    } catch (error) {
      console.error("Voting failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Voting failed"
      );
    } finally {
      setIsVoting({ ...isVoting, [requestId]: false });
    }
  };

  const handleExecute = async (requestId: number) => {
    if (!account) {
      setErrorMessage("Please connect your wallet");
      return;
    }

    setIsExecuting({ ...isExecuting, [requestId]: true });
    setErrorMessage("");

    try {
      const contract = getBenefitsPoolContract();
      const transaction = prepareContractCall({
        contract,
        method: "function executeWithdrawal(uint256 _requestId)",
        params: [BigInt(requestId)],
      });

      await sendTransaction(transaction);
      console.log(`Executed withdrawal request ${requestId}`);
    } catch (error) {
      console.error("Execution failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Execution failed"
      );
    } finally {
      setIsExecuting({ ...isExecuting, [requestId]: false });
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {activeRequestIds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No active withdrawal requests</p>
          </CardContent>
        </Card>
      ) : (
        activeRequestIds.map((requestId) => (
          <WithdrawalRequestCard
            key={requestId}
            requestId={requestId}
            account={account?.address}
            isVerified={workerInfo?.isVerified || false}
            onVote={handleVote}
            onExecute={handleExecute}
            isVoting={isVoting[requestId] || false}
            isExecuting={isExecuting[requestId] || false}
          />
        ))
      )}
    </div>
  );
}

interface WithdrawalRequestCardProps {
  requestId: number;
  account?: string;
  isVerified: boolean;
  onVote: (requestId: number, support: boolean) => void;
  onExecute: (requestId: number) => void;
  isVoting: boolean;
  isExecuting: boolean;
}

function WithdrawalRequestCard({
  requestId,
  account,
  isVerified,
  onVote,
  onExecute,
  isVoting,
  isExecuting,
}: WithdrawalRequestCardProps) {
  const { request, isLoading } = useWithdrawalRequest(requestId);
  const { hasVoted } = useHasVoted(requestId, account);

  if (isLoading || !request) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Skip if already executed
  if (request.executed) return null;

  const totalVotes = Number(request.votesFor) + Number(request.votesAgainst);
  const approvalPercentage = totalVotes > 0
    ? Math.round((Number(request.votesFor) / totalVotes) * 100)
    : 0;

  const votingPeriod = 7 * 24 * 60 * 60; // 7 days in seconds
  const votingEndTime = Number(request.createdAt) + votingPeriod;
  const now = Math.floor(Date.now() / 1000);
  const votingEnded = now > votingEndTime;
  const canExecute = votingEnded && !request.executed;

  const status = request.executed
    ? request.approved
      ? "approved"
      : "rejected"
    : "pending";

  const isOwnRequest = account?.toLowerCase() === request.worker.toLowerCase();

  const daysAgo = Math.floor((now - Number(request.createdAt)) / (60 * 60 * 24));
  const daysRemaining = Math.ceil((votingEndTime - now) / (60 * 60 * 24));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Request #{requestId}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              From: {request.worker.slice(0, 6)}...{request.worker.slice(-4)}
              {isOwnRequest && <Badge variant="outline" className="ml-2">Your Request</Badge>}
            </p>
          </div>
          <Badge
            variant={
              status === "approved"
                ? "default"
                : status === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-bold text-green-600">
            {formatTokenAmount(request.amount)} cUSD
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">Reason:</p>
          <p className="text-sm text-gray-700">{request.reason}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Voting Progress</span>
            <span className="text-xs text-gray-500">
              {approvalPercentage}% approval
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all ${
                approvalPercentage >= 60 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${approvalPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span className="font-medium">{request.votesFor.toString()} approve</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              <span className="font-medium">{request.votesAgainst.toString()} deny</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>
            Created {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
            {!votingEnded && daysRemaining > 0 && ` • ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left to vote`}
            {votingEnded && !request.executed && " • Voting ended, ready to execute"}
          </span>
        </div>

        {!request.executed && !votingEnded && !isOwnRequest && isVerified && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onVote(requestId, true)}
              variant="default"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isVoting || hasVoted}
            >
              {isVoting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <ThumbsUp className="mr-1 h-4 w-4" />
              )}
              {hasVoted ? "Voted" : "Approve"}
            </Button>
            <Button
              onClick={() => onVote(requestId, false)}
              variant="destructive"
              size="sm"
              className="flex-1"
              disabled={isVoting || hasVoted}
            >
              {isVoting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <ThumbsDown className="mr-1 h-4 w-4" />
              )}
              {hasVoted ? "Voted" : "Deny"}
            </Button>
          </div>
        )}

        {canExecute && (
          <Button
            onClick={() => onExecute(requestId)}
            className="w-full"
            size="lg"
            disabled={isExecuting}
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Execute Withdrawal
              </>
            )}
          </Button>
        )}

        {!isVerified && !votingEnded && !isOwnRequest && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-700">
              Only verified workers can vote. Verify your identity to participate in voting.
            </AlertDescription>
          </Alert>
        )}

        {isOwnRequest && !votingEnded && (
          <Alert className="bg-gray-50 border-gray-200">
            <AlertDescription className="text-sm text-gray-700">
              You cannot vote on your own withdrawal request
            </AlertDescription>
          </Alert>
        )}

        {hasVoted && !isOwnRequest && !votingEnded && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-700">
              You have already voted on this request
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
