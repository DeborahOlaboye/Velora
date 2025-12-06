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
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-green-600">Registration Successful!</CardTitle>
          <CardDescription className="text-lg">
            Welcome to the Velora Benefits Pool
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription>
              <p className="font-semibold text-green-900 mb-3">You can now access:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Make contributions to build your emergency fund</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Request withdrawals up to 100% of your contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Vote on community withdrawal requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Claim GoodDollar UBI daily</span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <AlertDescription>
              <p className="font-semibold text-purple-900 mb-2">Unlock More Benefits with Verification</p>
              <p className="text-sm text-purple-800 mb-3">
                Verification is optional but unlocks higher limits:
              </p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Withdraw up to 200% of contributions during emergencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Access community assistance funds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Build trust within the community</span>
                </li>
              </ul>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.href = '/verify'}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Verify Identity
                </Button>
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Go to Dashboard
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
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to begin the registration process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-800">
              You&apos;ll need a Web3 wallet (like MetaMask) to register and participate in the benefits pool.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${
                      currentStep > step.number
                        ? "bg-green-600 text-white shadow-md"
                        : currentStep === step.number
                        ? "bg-blue-600 text-white shadow-md scale-110"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <span className={`text-sm font-medium hidden md:block ${
                      currentStep >= step.number ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-gray-500 hidden lg:block mt-1">
                      {step.description}
                    </span>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 -mt-8 transition-all ${
                      currentStep > step.number ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Worker Information</CardTitle>
            <CardDescription className="text-base">Tell us about your gig work experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gigWorkType" className="text-sm font-medium">Type of Gig Work *</Label>
              <Select
                value={workerData.gigWorkType}
                onValueChange={(value) =>
                  setWorkerData({ ...workerData, gigWorkType: value })
                }
              >
                <SelectTrigger className="h-11">
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
              <p className="text-xs text-gray-500">Choose the type of gig work you primarily do</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location (City, Country) *</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, USA"
                value={workerData.location}
                onChange={(e) =>
                  setWorkerData({ ...workerData, location: e.target.value })
                }
                className="h-11"
              />
              <p className="text-xs text-gray-500">Where do you primarily work?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  placeholder="e.g., 2"
                  value={workerData.yearsExperience}
                  onChange={(e) =>
                    setWorkerData({ ...workerData, yearsExperience: e.target.value })
                  }
                  className="h-11"
                />
                <p className="text-xs text-gray-500">Optional field</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income" className="text-sm font-medium">Average Monthly Income (USD)</Label>
                <Input
                  id="income"
                  type="number"
                  min="0"
                  placeholder="e.g., 2000"
                  value={workerData.monthlyIncome}
                  onChange={(e) =>
                    setWorkerData({ ...workerData, monthlyIncome: e.target.value })
                  }
                  className="h-11"
                />
                <p className="text-xs text-gray-500">Optional field</p>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-800">
                This information will be stored permanently on the blockchain and cannot be edited later.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} disabled className="px-8">
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!workerData.gigWorkType || !workerData.location}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Initial Contribution</CardTitle>
            <CardDescription className="text-base">
              This is just for planning - you&apos;ll make your first contribution from your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contribution" className="text-sm font-medium">Planned Monthly Contribution (cUSD)</Label>
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
                className="h-11 text-lg"
              />
              <p className="text-sm text-gray-600">
                Minimum: 5 cUSD - Your contributions build your emergency fund
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 space-y-3">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                How the Benefits Pool Works
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span><strong>Tier 1 Access:</strong> Withdraw up to 100% of contributions (no verification needed)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span><strong>Tier 2 Access:</strong> Withdraw up to 200% of contributions (requires verification)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>Community voting on withdrawal requests for transparency</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <span>90-day cooldown between withdrawals to maintain pool stability</span>
                </li>
              </ul>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-sm text-yellow-800">
                <strong>Note:</strong> Registration is free. You can make your first contribution from your dashboard after registration.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="px-8">
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={parseFloat(workerData.initialContribution) < 5}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Review & Submit</CardTitle>
            <CardDescription className="text-base">
              Review your information before submitting to the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200 space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3">Registration Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Wallet Address</span>
                  <p className="text-sm text-gray-900 font-mono mt-1 break-all">{account.address}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Gig Work Type</span>
                  <p className="text-sm text-gray-900 mt-1">{workerData.gigWorkType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Location</span>
                  <p className="text-sm text-gray-900 mt-1">{workerData.location}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Years of Experience</span>
                  <p className="text-sm text-gray-900 mt-1">{workerData.yearsExperience || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Monthly Income</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {workerData.monthlyIncome ? `$${workerData.monthlyIncome} USD` : "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Planned Contribution</span>
                  <p className="text-sm text-gray-900 mt-1">{workerData.initialContribution} cUSD/month</p>
                </div>
              </div>
            </div>

            <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <AlertDescription>
                <p className="font-semibold text-purple-900 mb-2">About Verification</p>
                <p className="text-sm text-purple-800">
                  Verification is optional and can be done later from your dashboard. It unlocks access to withdraw up to 200% of your contributions during emergencies.
                </p>
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={workerData.agreedToTerms}
                  onChange={(e) =>
                    setWorkerData({ ...workerData, agreedToTerms: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  I agree to the terms and conditions of the Velora Benefits Pool, including the withdrawal rules and community voting system. I understand that my registration data will be permanently stored on the blockchain.
                </Label>
              </div>
            </div>

            {errorMessage && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700 font-medium">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="px-8">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!workerData.agreedToTerms || isSubmitting}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting to Blockchain...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
