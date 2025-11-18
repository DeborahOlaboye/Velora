"use client";

import { useEffect, useRef, useState } from "react";
import { SelfAppBuilder } from "@selfxyz/core";
import { SelfQRcodeWrapper } from "@selfxyz/qrcode";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

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

  useEffect(() => {
    if (!account?.address || !qrContainerRef.current) return;

    try {
      // Build Self Protocol app configuration
      const app = new SelfAppBuilder({
        version: 2,
        appName: "Velora",
        scope: "velora",
        endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "/api/verify",
        userId: account.address,
        disclosures: {
          minimumAge,
          ...requiredDisclosures,
        },
      }).build();

      // Create QR code wrapper
      const qrWrapper = new SelfQRcodeWrapper({
        container: qrContainerRef.current,
        app,
        onSuccess: (result) => {
          console.log("Verification successful:", result);
          setVerificationStatus("verified");
          onVerificationComplete?.(true, account.address);
        },
        onError: (error) => {
          console.error("Verification failed:", error);
          setVerificationStatus("failed");
          setErrorMessage(error.message || "Verification failed");
          onVerificationComplete?.(false, account.address);
        },
        onPending: () => {
          setVerificationStatus("pending");
        },
      });

      // Render QR code
      qrWrapper.render();

      return () => {
        qrWrapper.destroy?.();
      };
    } catch (error) {
      console.error("Failed to initialize Self Protocol:", error);
      setErrorMessage("Failed to initialize verification");
      setVerificationStatus("failed");
    }
  }, [account?.address, minimumAge, requiredDisclosures, onVerificationComplete]);

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
          Scan the QR code with the Self app to verify your identity using your government-issued ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Container */}
        <div
          ref={qrContainerRef}
          className="flex justify-center items-center min-h-[300px] bg-gray-50 rounded-lg"
        />

        {/* Status Indicators */}
        {verificationStatus === "pending" && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Verifying your identity...</span>
          </div>
        )}

        {verificationStatus === "verified" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Identity verified successfully!</span>
          </div>
        )}

        {verificationStatus === "failed" && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>{errorMessage || "Verification failed. Please try again."}</span>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-semibold">How to verify:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Download the Self app from your app store</li>
            <li>Scan this QR code with the Self app</li>
            <li>Follow the in-app instructions to scan your passport or ID</li>
            <li>Complete the liveness check</li>
            <li>Approve the data disclosure request</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
