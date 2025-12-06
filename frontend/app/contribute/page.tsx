"use client";

import { MakeContribution } from "@/components/contributions/make-contribution";
import { Header } from "@/components/layout/header";
import { DollarSign, TrendingUp, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 mb-6">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Make a Contribution
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build your emergency fund and support the mutual aid network
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Build Your Fund</h3>
                <p className="text-sm text-gray-600">
                  Every contribution grows your emergency fund and withdrawal limits
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Access Anytime</h3>
                <p className="text-sm text-gray-600">
                  Withdraw up to 100% of your contributions whenever you need it
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Help Others</h3>
                <p className="text-sm text-gray-600">
                  Your contributions help fund emergency withdrawals for fellow workers
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contribution Form */}
        <div className="max-w-2xl mx-auto">
          <MakeContribution />
        </div>
      </div>
    </div>
  );
}
