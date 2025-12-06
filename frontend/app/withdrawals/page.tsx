"use client";

import { WithdrawalRequestForm } from "@/components/withdrawals/withdrawal-request-form";
import { ActiveRequests } from "@/components/withdrawals/active-requests";
import { Header } from "@/components/layout/header";
import { Send, Users, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function WithdrawalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-700 mb-6">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emergency Withdrawals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Request emergency funds from your contributions and support fellow workers
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Send className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Request Withdrawal</h3>
                  <p className="text-sm text-gray-600">
                    Access up to 100% of your contributions instantly, or up to 200% with verification and community approval
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
                  <p className="text-sm text-gray-600">
                    Vote on withdrawal requests from other workers to help build a strong mutual aid network
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Request Form */}
          <div>
            <WithdrawalRequestForm />
          </div>

          {/* Right: Active Requests */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Active Community Requests
            </h2>
            <ActiveRequests />
          </div>
        </div>
      </div>
    </div>
  );
}
