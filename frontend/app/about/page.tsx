import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Globe, Zap, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Velora
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building financial safety nets for the gig economy workforce through blockchain technology
          </p>
        </div>

        <div className="mb-12">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Velora is a decentralized benefits pool designed specifically for gig workers who lack access to traditional safety nets. We leverage blockchain technology to create a transparent, community-driven mutual aid system that provides financial security during emergencies.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By pooling contributions and enabling democratic decision-making, Velora empowers gig workers to support each other while maintaining full control over their funds through self-custodial wallets.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Transparency</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  All transactions and decisions are recorded on the blockchain, ensuring complete transparency and accountability in how funds are managed and distributed.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Community-Driven</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Withdrawal requests are voted on by the community, creating a democratic system where members collectively decide how to support each other.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Solidarity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We believe in mutual aid and collective support. Every contribution helps build a stronger safety net for the entire community of gig workers.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Globe className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle>Accessibility</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Built on Celo blockchain with low transaction fees and mobile-first design, making it accessible to gig workers worldwide regardless of location.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Zap className="h-8 w-8 text-indigo-600" />
                  </div>
                  <CardTitle>Innovation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Leveraging cutting-edge blockchain technology, identity verification, and UBI integration to create a modern solution for an age-old problem.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Target className="h-8 w-8 text-pink-600" />
                  </div>
                  <CardTitle>Fairness</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Two-tier system ensures everyone has access to their contributions while verified members can access additional community support during emergencies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Gig workers make up a growing portion of the global workforce, but they lack access to traditional employment benefits like health insurance, unemployment benefits, and emergency funds. When unexpected expenses arise - medical emergencies, equipment failures, or income gaps - gig workers often have nowhere to turn.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Traditional financial institutions often exclude gig workers due to irregular income patterns, while mutual aid systems lack the transparency and scalability needed to serve a global workforce.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Velora bridges this gap by creating a decentralized, transparent, and democratic benefits pool that works for gig workers, by gig workers.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Technology</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Celo Blockchain</h3>
                  <p className="text-gray-700">
                    Built on Celo, a carbon-negative blockchain designed for mobile-first financial inclusion with ultra-low transaction fees.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Self Protocol Identity</h3>
                  <p className="text-gray-700">
                    Optional identity verification through Self Protocol enables higher withdrawal limits while maintaining privacy and security.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">GoodDollar UBI</h3>
                  <p className="text-gray-700">
                    Integration with GoodDollar provides additional universal basic income opportunities for community members.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">Thirdweb SDK</h3>
                  <p className="text-gray-700">
                    User-friendly wallet connection supporting multiple providers including email and social login for easy onboarding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Movement</h2>
              <p className="text-lg text-gray-700 mb-6">
                Be part of a global community building financial security for gig workers everywhere.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Get Started
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
