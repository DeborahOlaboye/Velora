import { WorkerRegistrationForm } from "@/components/registration/worker-registration-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Worker Registration
          </h1>
          <p className="text-lg text-gray-600">
            Join the Gig Worker Benefits Pool
          </p>
        </div>
        <WorkerRegistrationForm />
      </div>
    </div>
  );
}
