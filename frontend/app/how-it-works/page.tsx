import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, ArrowRight, Wallet, FileText, Vote, HandHeart, Shield, Clock } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Velora Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, transparent process for building your financial safety net
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Wallet className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-blue-600">1</span>
                  </div>
                  <CardTitle>Connect Wallet</CardTitle>
                  <CardDescription>Set up your Web3 wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Install a Web3 wallet like MetaMask or use email/social login through our integrated wallet provider.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Multiple wallet options supported</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Email and social login available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>You control your keys</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-green-600">2</span>
                  </div>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>Create your worker profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Provide basic information about your gig work to join the community. Registration is free.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Type of gig work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Location and experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>No fees to register</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <HandHeart className="h-8 w-8 text-purple-600" />
                    </div>
                    <span className="text-3xl font-bold text-purple-600">3</span>
                  </div>
                  <CardTitle>Contribute</CardTitle>
                  <CardDescription>Build your emergency fund</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Make contributions in cUSD to build your personal safety net and support the community.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Contribute any amount</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Track your total contributions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Earn voting rights</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Two-Tier System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-blue-900">Tier 1: No Verification</CardTitle>
                </div>
                <CardDescription className="text-blue-700 font-medium">
                  Available to everyone immediately
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">Withdrawal Limit</p>
                    <p className="text-2xl font-bold text-blue-600">Up to 100%</p>
                    <p className="text-sm text-gray-600 mt-1">of your total contributions</p>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>No identity verification required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Access your own contributions anytime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Subject to community voting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>90-day cooldown between withdrawals</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-purple-900">Tier 2: With Verification</CardTitle>
                </div>
                <CardDescription className="text-purple-700 font-medium">
                  Unlock higher limits with identity verification
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-2">Withdrawal Limit</p>
                    <p className="text-2xl font-bold text-purple-600">Up to 200%</p>
                    <p className="text-sm text-gray-600 mt-1">of your total contributions</p>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Verify identity via Self Protocol</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Access community assistance funds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Double your emergency support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Build trust in the community</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Making a Withdrawal</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="p-3 bg-orange-100 rounded-lg w-fit mb-2">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Step 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Submit a withdrawal request with the amount needed and reason for the emergency.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-lg w-fit mb-2">
                  <Vote className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Step 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Community members vote on your request. Transparency ensures fair decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="p-3 bg-blue-100 rounded-lg w-fit mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Step 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Voting period completes. Approved requests are processed automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-2">
                  <CheckCircle2 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Step 4</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Receive your funds directly to your wallet. 90-day cooldown begins.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Democratic Voting</h3>
                    <p className="text-gray-600">
                      All contributors can vote on withdrawal requests, ensuring community-driven decisions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Blockchain Transparency</h3>
                    <p className="text-gray-600">
                      Every transaction is recorded on-chain, providing complete transparency and accountability.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Self-Custodial</h3>
                    <p className="text-gray-600">
                      You maintain complete control over your wallet and funds at all times.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Low Fees</h3>
                    <p className="text-gray-600">
                      Built on Celo blockchain with minimal transaction costs, keeping more money in your pocket.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">GoodDollar UBI</h3>
                    <p className="text-gray-600">
                      Claim daily universal basic income tokens to supplement your contributions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Optional Verification</h3>
                    <p className="text-gray-600">
                      Identity verification is completely optional and only required for higher tier benefits.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
          <AlertDescription>
            <p className="font-semibold text-blue-900 mb-2">Ready to Get Started?</p>
            <p className="text-blue-800 mb-4">
              Join thousands of gig workers building financial security together.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Connect Your Wallet
            </a>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
