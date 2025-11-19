"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, Smartphone } from "lucide-react";
import { getUniversalLink } from "@selfxyz/core";
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp } from "@selfxyz/qrcode";
import { ethers } from "ethers";

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
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");

  // Initialize Self App when account is available
  useEffect(() => {
    if (!account?.address) return;

    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Velora",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "velora-app",
        endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "https://api.staging.self.xyz",
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png", // Replace with your app's logo
        userId: account.address,
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: "Velora Identity Verification",
        disclosures: {
          minimumAge: minimumAge,
          nationality: requiredDisclosures.nationality,
          gender: requiredDisclosures.gender,
          documentNumber: requiredDisclosures.documentNumber,
        },
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
      setVerificationStatus("pending"); // Move to pending state once QR code is ready
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
      setErrorMessage("Failed to initialize verification service");
      setVerificationStatus("failed");
    }
  }, [account?.address, minimumAge, requiredDisclosures]);

  const handleVerificationSuccess = (result: any) => {
    console.log("Verification successful:", result);
    setVerificationStatus("verified");
    if (account?.address) {
      onVerificationComplete?.(true, account.address);
    }
  };

  const handleVerificationError = (error: any) => {
    console.error("Verification failed:", error);
    setErrorMessage(error?.message || "Verification failed. Please try again.");
    setVerificationStatus("failed");
    if (account?.address) {
      onVerificationComplete?.(false, account.address);
    }
  };

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
          Verify your identity using Self Protocol to access all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center p-6 space-y-6 bg-white rounded-lg">
          {verificationStatus === "pending" && (
            <>
              <div className="p-4 bg-gray-100 rounded-lg">
                {selfApp ? (
                  <div className="p-2 bg-white rounded">
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={handleVerificationSuccess}
                      onError={handleVerificationError}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-64 h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Smartphone className="w-4 h-4" />
                <span>Scan with the Self app on your mobile device</span>
              </div>
              {universalLink && (
                <a
                  href={universalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-blue-600 hover:underline"
                >
                  Or open in Self app directly
                </a>
              )}
            </>
          )}

          {verificationStatus === "verified" && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 text-green-600">
              <CheckCircle2 className="w-12 h-12" />
              <p className="text-lg font-medium">Identity Verified Successfully!</p>
              <p className="text-sm text-gray-600">Your identity has been successfully verified with Self Protocol.</p>
            </div>
          )}

          {verificationStatus === "failed" && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
              <XCircle className="w-12 h-12 text-red-600" />
              <p className="text-lg font-medium text-red-600">Verification Failed</p>
              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
              <button
                onClick={() => setVerificationStatus("pending")}
                className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
