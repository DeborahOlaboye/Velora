import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Code, Shield, Users, Wallet, FileText } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Velora Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about using the Velora Benefits Pool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">Learn how to connect your wallet and register as a worker.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Install a Web3 wallet (MetaMask, Coinbase Wallet, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Connect to Celo network (Mainnet or Testnet)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Register with your gig work information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Start contributing to build your safety net</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Making Contributions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">Understand how contributions work and build your emergency fund.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <span>Contribute any amount of cUSD to the pool</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <span>Track your total contributions on the dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <span>All contributions are recorded on the blockchain</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                  <span>Build voting rights in the community</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Withdrawal Tiers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">Learn about the two-tier withdrawal system.</p>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-1">Tier 1 (No Verification)</p>
                  <p className="text-sm text-gray-700">Withdraw up to 100% of your total contributions anytime.</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-semibold text-purple-900 mb-1">Tier 2 (With Verification)</p>
                  <p className="text-sm text-gray-700">Withdraw up to 200% of contributions during emergencies with community support.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Withdrawal Process</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">How to request and receive withdrawals from the pool.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>Submit withdrawal request with reason</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>Community voting period (transparent process)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>Receive funds once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>90-day cooldown between withdrawals</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Code className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Smart Contract Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Velora is built on the Celo blockchain using secure, audited smart contracts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">Networks Supported</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>Celo Mainnet (Chain ID: 42220)</li>
                  <li>Celo Alfajores Testnet (Chain ID: 44787)</li>
                  <li>Celo Sepolia Testnet (Chain ID: 11142220)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">Token Used</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>cUSD (Celo Dollar)</li>
                  <li>Stable cryptocurrency pegged to USD</li>
                  <li>Low transaction fees on Celo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="bg-blue-50 border-blue-200">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <AlertDescription>
            <p className="font-semibold text-blue-900 mb-2">Need More Help?</p>
            <p className="text-sm text-blue-800">
              For detailed technical documentation and API references, visit our GitHub repository or join our community Discord server.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
