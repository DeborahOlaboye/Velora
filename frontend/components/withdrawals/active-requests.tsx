"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ThumbsUp, ThumbsDown, Clock, CheckCircle2, XCircle } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  amount: number;
  reason: string;
  urgencyLevel: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  votingDeadline: string;
  user: {
    walletAddress: string;
    gigWorkType: string;
    location: string;
  };
  votes: Array<{
    support: boolean;
    voterId: string;
  }>;
}

export function ActiveRequests() {
  const account = useActiveAccount();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingOn, setVotingOn] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/withdrawals?status=VOTING");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.withdrawals || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (requestId: string, support: boolean) => {
    if (!account) return;

    setVotingOn(requestId);

    try {
      // TODO: Call smart contract to cast vote
      // const contract = getBenefitsPoolContract();
      // const transaction = prepareContractCall({
      //   contract,
      //   method: "vote",
      //   params: [requestId, support],
      // });
      // const result = await sendTransaction(transaction);

      // Simulate vote
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Record in database
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: account.address,
          withdrawalId: requestId,
          support,
          txHash: `0x${Math.random().toString(16).slice(2)}`,
        }),
      });

      if (response.ok) {
        fetchRequests(); // Refresh requests
      }
    } catch (error) {
      console.error("Vote failed:", error);
      alert("Failed to cast vote. Please try again.");
    } finally {
      setVotingOn(null);
    }
  };

  const hasVoted = (request: WithdrawalRequest) => {
    if (!account) return false;
    return request.votes.some((v) => v.voterId === account.address);
  };

  const calculateApprovalRate = (request: WithdrawalRequest) => {
    const total = request.votesFor + request.votesAgainst;
    if (total === 0) return 0;
    return (request.votesFor / total) * 100;
  };

  const getTimeRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No active withdrawal requests at the moment
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const approvalRate = calculateApprovalRate(request);
        const voted = hasVoted(request);
        const isOwnRequest = account?.address === request.user.walletAddress;

        return (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Emergency Withdrawal Request</CardTitle>
                  <CardDescription>
                    {request.user.gigWorkType} from {request.user.location}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {request.amount.toFixed(2)} cUSD
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeRemaining(request.votingDeadline)} left
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Reason:</h4>
                <p className="text-gray-700">{request.reason}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Voting Progress</span>
                  <span className="text-sm">
                    {request.votesFor + request.votesAgainst} votes
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      approvalRate >= 60 ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${approvalRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    {request.votesFor} approve ({approvalRate.toFixed(0)}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                    {request.votesAgainst} deny
                  </span>
                </div>
              </div>

              {!account && (
                <Alert>
                  <AlertDescription>
                    Connect your wallet to vote on this request
                  </AlertDescription>
                </Alert>
              )}

              {isOwnRequest && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-700">
                    This is your withdrawal request. You cannot vote on it.
                  </AlertDescription>
                </Alert>
              )}

              {voted && !isOwnRequest && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    You have already voted on this request
                  </AlertDescription>
                </Alert>
              )}

              {account && !voted && !isOwnRequest && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleVote(request.id, true)}
                    disabled={votingOn === request.id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {votingOn === request.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleVote(request.id, false)}
                    disabled={votingOn === request.id}
                    variant="destructive"
                    className="flex-1"
                  >
                    {votingOn === request.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsDown className="mr-2 h-4 w-4" />
                    )}
                    Deny
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
