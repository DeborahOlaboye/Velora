"use client";

import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelfProtocolVerifier } from "@/components/verification/self-protocol-verifier";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { CheckCircle2, Shield, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  const account = useActiveAccount();
  const { workerInfo, isLoading } = useWorkerInfo(account?.address);

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to verify your identity
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!workerInfo?.isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="flex justify-between items-center">
                <span>You must register as a worker before verifying your identity</span>
                <Link href="/register">
                  <Button size="sm">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (workerInfo.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Identity Verification
            </h1>
            <p className="text-lg text-gray-600">
              Verify your identity to unlock higher withdrawal limits
            </p>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-green-900 text-lg">
                  ✓ Your Identity is Verified
                </p>
                <p className="text-green-800">
                  You have full access to all Velora benefits, including Tier 2 withdrawal limits (up to 200% of your contributions).
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Benefits
              </CardTitle>
              <CardDescription>What you've unlocked with verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Higher Withdrawal Limits</p>
                    <p className="text-sm text-gray-600">
                      Access up to 200% of your contributions during emergencies
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Voting Rights</p>
                    <p className="text-sm text-gray-600">
                      Participate in community decisions on withdrawal requests
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Community Trust</p>
                    <p className="text-sm text-gray-600">
                      Build trust with fellow workers in the mutual aid network
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Priority Support</p>
                    <p className="text-sm text-gray-600">
                      Faster processing of withdrawal requests
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/withdrawals" className="flex-1">
              <Button className="w-full">
                Request Withdrawal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Identity Verification
          </h1>
          <p className="text-lg text-gray-600">
            Verify your identity to unlock higher withdrawal limits
          </p>
        </div>

        {/* Benefits Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Why Verify?
            </CardTitle>
            <CardDescription>Benefits of completing identity verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="bg-green-600">Tier 1</Badge>
                  <span className="text-sm font-medium">Without Verification</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  100% Limit
                </p>
                <p className="text-sm text-gray-600">
                  Withdraw up to 100% of your contributions (your money)
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="bg-blue-600">Tier 2</Badge>
                  <span className="text-sm font-medium">With Verification</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  200% Limit
                </p>
                <p className="text-sm text-gray-600">
                  Access community assistance during emergencies
                </p>
              </div>
            </div>

            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 Verification is Optional</p>
                <p>
                  You can use Velora without verification, but verifying unlocks full benefits including voting rights and higher emergency fund access.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Verification Process */}
        <Card>
          <CardHeader>
            <CardTitle>Verify with Self Protocol</CardTitle>
            <CardDescription>
              Complete identity verification using Self Protocol's secure verification system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SelfProtocolVerifier
              onVerificationComplete={(verified) => {
                if (verified) {
                  window.location.reload();
                }
              }}
            />
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card>
          <CardHeader>
            <CardTitle>What Happens After Verification?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <p>Your verification status is updated on-chain by the contract owner</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <p>Your withdrawal limits automatically increase to 200% of contributions</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <p>You gain voting rights on community withdrawal requests</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <p>You can participate fully in the mutual aid network</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
