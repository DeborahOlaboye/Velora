"use client";

import { WorkerRegistrationForm } from "@/components/registration/worker-registration-form";
import { Header } from "@/components/layout/header";
import { Shield } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Velora Benefits Pool
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register as a gig worker to access mutual aid, emergency funds, and community support
          </p>
        </div>

        <WorkerRegistrationForm />
      </div>
    </div>
  );
}
