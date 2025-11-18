import { WithdrawalRequestForm } from "@/components/withdrawals/withdrawal-request-form";
import { ActiveRequests } from "@/components/withdrawals/active-requests";

export default function WithdrawalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Emergency Withdrawals
          </h1>
          <p className="text-lg text-gray-600">
            Request emergency funds and vote on community requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Request Form */}
          <div>
            <WithdrawalRequestForm />
          </div>

          {/* Right: Active Requests */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Requests</h2>
            <ActiveRequests />
          </div>
        </div>
      </div>
    </div>
  );
}
