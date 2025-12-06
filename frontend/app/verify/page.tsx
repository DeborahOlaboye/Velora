"use client";

import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelfProtocolVerifier } from "@/components/verification/self-protocol-verifier";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";
import { CheckCircle2, Shield, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import Link from "next/link";

export default function VerifyPage() {
  const account = useActiveAccount();
  const { workerInfo, isLoading } = useWorkerInfo(account?.address);

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to verify your identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  You need to connect your wallet to access identity verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-lg">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert className="bg-yellow-50 border-yellow-200 shadow-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <span>You must register as a worker before verifying your identity</span>
                <Link href="/register">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 whitespace-nowrap">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Identity Verified
            </h1>
            <p className="text-xl text-gray-600">
              You have full access to all Velora benefits
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
              <CardDescription>What you&apos;ve unlocked with verification</CardDescription>
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-700 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Identity Verification
          </h1>
          <p className="text-xl text-gray-600">
            Unlock higher withdrawal limits and community voting rights
          </p>
        </div>

        {/* Benefits Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-purple-600" />
              Why Verify Your Identity?
            </CardTitle>
            <CardDescription className="text-base">Benefits of completing identity verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="bg-green-600">Tier 1</Badge>
                  <span className="text-sm font-medium text-gray-700">Without Verification</span>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  100% Limit
                </p>
                <p className="text-sm text-gray-600">
                  Withdraw up to 100% of your contributions anytime
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-300 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="bg-blue-600">Tier 2</Badge>
                  <span className="text-sm font-medium text-gray-700">With Verification</span>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  200% Limit
                </p>
                <p className="text-sm text-gray-600">
                  Access community assistance during emergencies
                </p>
              </div>
            </div>

            <Alert className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <AlertDescription>
                <p className="font-semibold text-purple-900 mb-2">Verification is Optional</p>
                <p className="text-sm text-purple-800">
                  You can use Velora without verification, but verifying unlocks full benefits including voting rights and higher emergency fund access.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Verification Process */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Verify with Self Protocol</CardTitle>
            <CardDescription className="text-base">
              Complete identity verification using Self Protocol&apos;s secure verification system
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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">What Happens After Verification?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <p className="mt-1">Your verification status is updated on-chain by the contract owner</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <p className="mt-1">Your withdrawal limits automatically increase to 200% of contributions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <p className="mt-1">You gain voting rights on community withdrawal requests</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                  4
                </div>
                <p className="mt-1">You can participate fully in the mutual aid network</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
