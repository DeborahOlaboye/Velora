"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { WorkerProfile } from "@/components/profile/worker-profile";
import { ClaimWidget } from "@/components/gooddollar/claim-widget";
import { SelfProtocolVerifier } from "@/components/verification/self-protocol-verifier";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";

export default function DashboardPage() {
  const account = useActiveAccount();
  const [isVerified, setIsVerified] = useState(false);

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage your participation in the Gig Worker Benefits Pool
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="gooddollar">GoodDollar</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <WorkerProfile />
          </TabsContent>

          <TabsContent value="gooddollar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClaimWidget
                environment={
                  process.env.NEXT_PUBLIC_GOODDOLLAR_ENV === "production"
                    ? "production"
                    : "development"
                }
                onClaimSuccess={(amount) => {
                  console.log("Claimed:", amount);
                  alert(`Successfully claimed ${amount} G$ tokens!`);
                }}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Auto-Contribute to Pool</CardTitle>
                  <CardDescription>
                    Automatically contribute your GoodDollar claims to the benefits pool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">How it works</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Claim your daily GoodDollar UBI</li>
                        <li>• Choose to contribute some or all to the pool</li>
                        <li>• Help fellow gig workers in emergencies</li>
                        <li>• Build a stronger mutual aid network</li>
                      </ul>
                    </div>

                    <Alert>
                      <AlertDescription>
                        Auto-contribute feature coming soon! For now, claim your G$ and
                        manually convert to cUSD to contribute.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <SelfProtocolVerifier
              onVerificationComplete={(verified) => setIsVerified(verified)}
            />

            {isVerified && (
              <Card>
                <CardHeader>
                  <CardTitle>Verification Complete</CardTitle>
                  <CardDescription>
                    Your identity has been verified successfully
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ You can now participate fully in the Benefits Pool, including
                      making contributions and requesting emergency withdrawals.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
