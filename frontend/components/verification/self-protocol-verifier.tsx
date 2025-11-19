"use client";

import { useEffect, useRef, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

// Temporary implementation - will be replaced with actual Self Protocol integration
const useSelfVerification = ({
  onSuccess,
  onError,
  onPending,
  userId,
  minimumAge = 18,
  requiredDisclosures = { nationality: true }
}: {
  onSuccess: (result: any) => void;
  onError: (error: Error) => void;
  onPending: () => void;
  userId: string;
  minimumAge?: number;
  requiredDisclosures?: {
    nationality?: boolean;
    gender?: boolean;
    documentNumber?: boolean;
  };
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Simulate verification process
  const startVerification = () => {
    setIsVerifying(true);
    onPending();
    
    // Simulate API call
    setTimeout(() => {
      try {
        // In a real implementation, this would be the actual verification logic
        const result = {
          success: true,
          userId,
          verifiedData: {
            ageVerified: true,
            minimumAge,
            ...requiredDisclosures
          }
        };
        onSuccess(result);
      } catch (error) {
        onError(error instanceof Error ? error : new Error('Verification failed'));
      } finally {
        setIsVerifying(false);
      }
    }, 2000);
  };

  return {
    isInitialized,
    isVerifying,
    startVerification,
  };
};

interface SelfProtocolVerifierProps {
  onVerificationComplete?: (verified: boolean, userId: string) => void;
  minimumAge?: number;
  requiredDisclosures?: {
    nationality?: boolean;
    gender?: boolean;
    documentNumber?: boolean;
  };
}

export function SelfProtocolVerifier({
  onVerificationComplete,
  minimumAge = 18,
  requiredDisclosures = { nationality: true }
}: SelfProtocolVerifierProps) {
  const account = useActiveAccount();
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "pending" | "verified" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const { isVerifying, startVerification } = useSelfVerification({
    userId: account?.address || "",
    minimumAge,
    requiredDisclosures,
    onSuccess: (result) => {
      console.log("Verification successful:", result);
      setVerificationStatus("verified");
      if (account?.address) {
        onVerificationComplete?.(true, account.address);
      }
    },
    onError: (error: Error) => {
      console.error("Verification failed:", error);
      setVerificationStatus("failed");
      setErrorMessage(error?.message || "Verification failed");
      if (account?.address) {
        onVerificationComplete?.(false, account.address);
      }
    },
    onPending: () => {
      setVerificationStatus("pending");
    },
  });

  useEffect(() => {
    if (account?.address && verificationStatus === "idle") {
      // Start verification when account is connected
      startVerification();
    }
  }, [account?.address, verificationStatus, startVerification]);

  if (!account) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your wallet to begin identity verification
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>
          Complete identity verification to access all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center p-4 bg-white rounded-lg">
          {verificationStatus === "pending" && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-center">Verifying your identity...</p>
            </div>
          )}
          {verificationStatus === "verified" && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 text-green-600">
              <CheckCircle2 className="w-12 h-12" />
              <p className="text-center">Identity verified successfully!</p>
            </div>
          )}
          {verificationStatus === "failed" && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 text-red-600">
              <XCircle className="w-12 h-12" />
              <p className="text-center">Verification failed</p>
              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            </div>
          )}
          {verificationStatus === "idle" && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <p className="text-center">Click the button below to start verification</p>
              <button
                onClick={startVerification}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Start Verification'}
              </button>
            </div>
          )}
        </div>

        {verificationStatus === "failed" && (
          <button
            onClick={startVerification}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Retry Verification'}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
