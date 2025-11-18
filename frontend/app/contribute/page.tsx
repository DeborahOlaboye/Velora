import { MakeContribution } from "@/components/contributions/make-contribution";

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Make a Contribution
          </h1>
          <p className="text-lg text-gray-600">
            Support the mutual aid pool for gig workers
          </p>
        </div>
        <MakeContribution />
      </div>
    </div>
  );
}
