"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SelfProtocolVerifier } from "@/components/verification/self-protocol-verifier";
import { CheckCircle2, Loader2 } from "lucide-react";

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
  { number: 1, title: "Identity Verification", description: "Verify your identity with Self Protocol" },
  { number: 2, title: "Worker Information", description: "Tell us about your gig work" },
  { number: 3, title: "Contribution Setup", description: "Set your initial contribution" },
  { number: 4, title: "Review & Submit", description: "Review and submit your registration" },
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workerData, setWorkerData] = useState<WorkerData>({
    gigWorkType: "",
    location: "",
    yearsExperience: "",
    monthlyIncome: "",
    initialContribution: "5",
    agreedToTerms: false,
  });

  const handleVerificationComplete = (verified: boolean, userId: string) => {
    setIsVerified(verified);
    if (verified) {
      setTimeout(() => setCurrentStep(2), 1500);
    }
  };

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
    setIsSubmitting(true);
    try {
      // TODO: Submit to smart contract
      // await registerWorker(account.address, workerData);
      console.log("Registering worker:", { address: account?.address, ...workerData });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert("Registration successful! Welcome to the Benefits Pool.");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <SelfProtocolVerifier onVerificationComplete={handleVerificationComplete} />
      )}

      {currentStep === 2 && (
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

      {currentStep === 3 && (
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
                <li>• Minimum contribution: 5 cUSD per month</li>
                <li>• Emergency withdrawals up to 50% of your contributions</li>
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

      {currentStep === 4 && (
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
                <span className="font-semibold">Identity Verified:</span>
                <p className="text-sm text-green-600">✓ Verified with Self Protocol</p>
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
