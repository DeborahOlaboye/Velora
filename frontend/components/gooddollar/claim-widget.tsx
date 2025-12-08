"use client";

import { useEffect, useRef, useState } from "react";
import "@goodsdks/ui-components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";

interface ClaimWidgetProps {
  environment?: "production" | "staging" | "development";
  onClaimSuccess?: (amount: string) => void;
}

// Extend JSX to include custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "claim-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          environment?: string;
          appkitConfig?: any;
        },
        HTMLElement
      >;
    }
  }
}

export function ClaimWidget({
  environment = "development",
  onClaimSuccess,
}: ClaimWidgetProps) {
  const claimButtonRef = useRef<HTMLElement>(null);
  const [autoContribute, setAutoContribute] = useState(true); // Default to enabled
  const [isSaving, setIsSaving] = useState(false);
  const account = useActiveAccount();

  useEffect(() => {
    // Configure the claim button once it's defined
    customElements.whenDefined("claim-button").then(() => {
      if (claimButtonRef.current) {
        // Set AppKit configuration for wallet connection
        // Note: Get your project ID from https://cloud.reown.com/
        (claimButtonRef.current as any).appkitConfig = {
          projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
          metadata: {
            name: "Velora",
            description: "Claim GoodDollar UBI and contribute to the mutual aid pool",
            url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            icons: ["/logo.png"],
          },
        };

        // Listen for claim events
        claimButtonRef.current.addEventListener("claim-success", (async (event: Event) => {
          const customEvent = event as CustomEvent;
          console.log("Claim successful:", customEvent.detail);

          // Record the claim with auto-contribute preference
          if (account?.address) {
            try {
              await fetch("/api/gooddollar/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  walletAddress: account.address,
                  amount: customEvent.detail.amount,
                  txHash: customEvent.detail.txHash || "",
                  autoContribute,
                }),
              });
            } catch (error) {
              console.error("Error recording claim:", error);
            }
          }

          onClaimSuccess?.(customEvent.detail.amount);
        }) as EventListener);
      }
    });
  }, [onClaimSuccess, autoContribute, account?.address]);

  // Handle auto-contribute toggle change
  const handleAutoContributeChange = async (checked: boolean) => {
    setAutoContribute(checked);
    setIsSaving(true);

    try {
      // Save preference to localStorage for immediate use
      localStorage.setItem("gooddollar_auto_contribute", String(checked));
    } catch (error) {
      console.error("Error saving auto-contribute preference:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gooddollar_auto_contribute");
      if (saved !== null) {
        setAutoContribute(saved === "true");
      }
    } catch (error) {
      console.error("Error loading auto-contribute preference:", error);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim GoodDollar UBI</CardTitle>
        <CardDescription>
          Claim your daily Universal Basic Income and optionally contribute to the benefits pool
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* GoodDollar Claim Button */}
          <div className="flex justify-center">
            <claim-button
              ref={claimButtonRef as any}
              environment={environment}
              className="w-full"
            />
          </div>

          {/* Auto-Contribute Toggle */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="auto-contribute"
                checked={autoContribute}
                onCheckedChange={handleAutoContributeChange}
                disabled={isSaving}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="auto-contribute"
                  className="text-sm font-semibold text-gray-900 cursor-pointer"
                >
                  Auto-contribute to emergency fund
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Automatically add your claimed G$ to the benefits pool to build your safety net
                  and support the community
                </p>
              </div>
            </div>
          </div>

          {/* Status Alert */}
          {autoContribute && (
            <Alert className="bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-800">
                Your claimed G$ will be automatically contributed to your emergency fund,
                increasing your withdrawal limits.
              </AlertDescription>
            </Alert>
          )}

          {/* Information */}
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-semibold">About GoodDollar:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Claim free G$ tokens daily as Universal Basic Income</li>
              <li>Supports Celo and Fuse networks</li>
              <li>Requires face verification for new users</li>
              <li>Build your safety net with zero cost</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
