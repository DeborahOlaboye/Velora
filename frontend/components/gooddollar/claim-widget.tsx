"use client";

import { useEffect, useRef } from "react";
import "@goodsdks/ui-components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        claimButtonRef.current.addEventListener("claim-success", ((event: CustomEvent) => {
          console.log("Claim successful:", event.detail);
          onClaimSuccess?.(event.detail.amount);
        }) as EventListener);
      }
    });
  }, [onClaimSuccess]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim GoodDollar UBI</CardTitle>
        <CardDescription>
          Claim your daily Universal Basic Income and optionally contribute to the benefits pool
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* GoodDollar Claim Button */}
          <claim-button
            ref={claimButtonRef as any}
            environment={environment}
            className="w-full"
          />

          {/* Information */}
          <div className="text-sm text-gray-600 space-y-2 w-full">
            <p className="font-semibold">About GoodDollar:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Claim free G$ tokens daily as Universal Basic Income</li>
              <li>Supports Celo and Fuse networks</li>
              <li>Requires face verification for new users</li>
              <li>Help gig workers by contributing your G$ to the pool</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
