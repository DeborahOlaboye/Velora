"use client";

import { useState } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2 } from "lucide-react";
import { prepareContractCall } from "thirdweb";
import { getBenefitsPoolContract } from "@/lib/contracts";
import { useWorkerInfo } from "@/hooks/useWorkerInfo";

interface WorkerData {
  gigWorkType: string;
  location: string;
  yearsExperience: string;
  monthlyIncome: string;
  initialContribution: string;
  agreedToTerms: boolean;
}

interface RegistrationStep {
  number: number;
  title: string;
  description: string;
}

const STEPS: RegistrationStep[] = [
  { number: 1, title: "Worker Information", description: "Tell us about your gig work" },
  { number: 2, title: "Contribution Setup", description: "Set your initial contribution" },
  { number: 3, title: "Review & Submit", description: "Review and submit your registration" },
];

const GIG_WORK_TYPES = [
  "Ride-share Driver",
  "Food Delivery",
  "Freelance Writer",
  "Graphic Designer",
  "Web Developer",
  "Virtual Assistant",
  "Photographer",
  "Tutor",
  "Other",
];

export function WorkerRegistrationForm() {
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { workerInfo, refetch: refetchWorkerInfo } = useWorkerInfo(account?.address);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [workerData, setWorkerData] = useState<WorkerData>({
    gigWorkType: "",
    location: "",
    yearsExperience: "",
    monthlyIncome: "",
    initialContribution: "5",
    agreedToTerms: false,
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!account) {
      setErrorMessage("Please connect your wallet");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Check if already registered
      if (workerInfo?.isRegistered) {
        setErrorMessage("You are already registered");
        setIsSubmitting(false);
        return;
      }

      // Prepare contract call to registerWorker() with metadata
      const contract = getBenefitsPoolContract();
      const transaction = prepareContractCall({
        contract,
        method: "function registerWorker(string _gigWorkType, string _location, uint8 _yearsExperience, uint256 _monthlyIncome)",
        params: [
          workerData.gigWorkType,
          workerData.location,
          parseInt(workerData.yearsExperience) || 0,
          BigInt(Math.floor(parseFloat(workerData.monthlyIncome) || 0)),
        ],
      });

      // Send transaction
      const result = await sendTransaction(transaction);
      console.log("Registration transaction sent:", result);

      // Refetch worker info to update the UI with on-chain data
      await refetchWorkerInfo();

      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">✓ Registration Successful!</CardTitle>
          <CardDescription className="text-center">
            Welcome to the Velora Benefits Pool
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>
              <p className="font-semibold mb-2">You can now:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Make contributions to the pool</li>
                <li>Request withdrawals up to 100% of your contributions</li>
                <li>Vote on community withdrawal requests</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <p className="font-semibold mb-2">💡 Optional: Verify Your Identity</p>
              <p className="text-sm mb-2">
                Verification is NOT required to participate, but it unlocks:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                <li>Access to community assistance (withdraw up to 200% of contributions)</li>
                <li>Higher withdrawal limits during emergencies</li>
                <li>Increased trust in the community</li>
              </ul>
              <div className="flex gap-2">
                <Button onClick={() => window.location.href = '/verify'} size="sm">
                  Verify Now
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'} variant="outline" size="sm">
                  Skip for Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!account) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your wallet to begin registration
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep > step.number
                    ? "bg-green-500 text-white"
                    : currentStep === step.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <span className="text-xs mt-2 text-center hidden md:block">
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Worker Information</CardTitle>
            <CardDescription>Tell us about your gig work experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gigWorkType">Type of Gig Work</Label>
              <Select
                value={workerData.gigWorkType}
                onValueChange={(value) =>
                  setWorkerData({ ...workerData, gigWorkType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gig work type" />
                </SelectTrigger>
                <SelectContent>
                  {GIG_WORK_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (City, Country)</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, USA"
                value={workerData.location}
                onChange={(e) =>
                  setWorkerData({ ...workerData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                placeholder="e.g., 2"
                value={workerData.yearsExperience}
                onChange={(e) =>
                  setWorkerData({ ...workerData, yearsExperience: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">Average Monthly Income (USD)</Label>
              <Input
                id="income"
                type="number"
                min="0"
                placeholder="e.g., 2000"
                value={workerData.monthlyIncome}
                onChange={(e) =>
                  setWorkerData({ ...workerData, monthlyIncome: e.target.value })
                }
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!workerData.gigWorkType || !workerData.location}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Initial Contribution</CardTitle>
            <CardDescription>
              Set your monthly contribution to the benefits pool (minimum 5 cUSD)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contribution">Monthly Contribution (cUSD)</Label>
              <Input
                id="contribution"
                type="number"
                min="5"
                step="0.01"
                placeholder="5.00"
                value={workerData.initialContribution}
                onChange={(e) =>
                  setWorkerData({ ...workerData, initialContribution: e.target.value })
                }
              />
              <p className="text-sm text-gray-600">
                Your contribution helps build a safety net for all workers
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">Benefits Pool Information</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Minimum contribution: 5 cUSD</li>
                <li>• Tier 1: Withdraw up to 100% of contributions (no verification)</li>
                <li>• Tier 2: Withdraw up to 200% of contributions (with verification)</li>
                <li>• Community voting on withdrawal requests</li>
                <li>• 90-day cooldown between withdrawals</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={parseFloat(workerData.initialContribution) < 5}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
            <CardDescription>
              Review your information and submit your registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <span className="font-semibold">Wallet Address:</span>
                <p className="text-sm text-gray-700">{account.address}</p>
              </div>
              <div>
                <span className="font-semibold">Gig Work Type:</span>
                <p className="text-sm text-gray-700">{workerData.gigWorkType}</p>
              </div>
              <div>
                <span className="font-semibold">Location:</span>
                <p className="text-sm text-gray-700">{workerData.location}</p>
              </div>
              <div>
                <span className="font-semibold">Monthly Contribution:</span>
                <p className="text-sm text-gray-700">
                  {workerData.initialContribution} cUSD
                </p>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-1">📝 Note about verification:</p>
                <p>Verification is optional. You can verify later to unlock higher withdrawal limits (up to 200% of contributions).</p>
              </AlertDescription>
            </Alert>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={workerData.agreedToTerms}
                onChange={(e) =>
                  setWorkerData({ ...workerData, agreedToTerms: e.target.checked })
                }
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions of the Gig Worker Benefits Pool,
                including the withdrawal rules and community voting system.
              </Label>
            </div>

            {errorMessage && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!workerData.agreedToTerms || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
