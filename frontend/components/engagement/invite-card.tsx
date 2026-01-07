"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import {  Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Users,
  Gift,
  Share2,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { generateInviteLink, getInviteStats } from "@/lib/engagement-rewards";

interface InviteStats {
  totalInvites: number;
  successfulInvites: number;
  pendingInvites: number;
  totalRewardsEarned: string;
}

export function InviteCard() {
  const account = useActiveAccount();
  const [inviteLink, setInviteLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<InviteStats>({
    totalInvites: 0,
    successfulInvites: 0,
    pendingInvites: 0,
    totalRewardsEarned: "0",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account?.address) {
      const link = generateInviteLink(account.address);
      setInviteLink(link);
      fetchStats();
    }
  }, [account?.address]);

  const fetchStats = async () => {
    if (!account?.address) return;

    setLoading(true);
    try {
      const data = await getInviteStats(account.address);
      setStats(data);
    } catch (error) {
      console.error("Error fetching invite stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Velora Benefits Pool",
          text: "Join me on Velora - a mutual aid platform for gig workers. Get rewards when you sign up!",
          url: inviteLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  if (!account) {
    return null;
  }

  return (
    <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-600" />
              Invite Friends & Earn Rewards
            </CardTitle>
            <CardDescription>
              Share Velora with friends and both earn G$ tokens
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalRewardsEarned} G$
            </div>
            <div className="text-xs text-gray-600">Total Earned</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reward Info */}
        <Alert className="bg-white border-purple-200">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-purple-900">Earn G$ Tokens!</div>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Your friend gets <strong>10 G$</strong> when they register</li>
                <li>• You get <strong>5 G$</strong> for each successful referral</li>
                <li>• Rewards are paid automatically on registration</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Invite Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-purple-100">
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalInvites}
            </div>
            <div className="text-xs text-gray-600">Total Invites</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              {stats.successfulInvites}
            </div>
            <div className="text-xs text-gray-600">Successful</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingInvites}
            </div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
        </div>

        {/* Invite Link */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="h-4 w-4" />
            Your Invite Link
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-white rounded-lg border border-purple-200 p-3 flex items-center gap-2 overflow-hidden">
              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 text-sm text-gray-600 bg-transparent border-none outline-none"
              />
            </div>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={shareInvite}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </Button>
          <Button
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on Velora - a mutual aid platform for gig workers! 🚀\n\nGet rewards when you sign up: ${inviteLink}`)}`, "_blank")}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Tweet
          </Button>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            How Referrals Work
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <span>Share your unique invite link with friends</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <span>They register using your link and complete identity verification</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <span>Both of you receive G$ tokens automatically</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <span>Use G$ for contributions or trade on exchanges</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
