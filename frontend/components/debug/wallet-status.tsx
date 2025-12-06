"use client";

import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { activeChain } from "@/lib/thirdweb-client";

export function WalletStatus() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  return (
    <Card className="mb-4 border-2 border-blue-500">
      <CardHeader>
        <CardTitle className="text-sm">Wallet Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Account:</strong>{" "}
          {account ? (
            <Badge variant="default" className="bg-green-600">
              Connected: {account.address.slice(0, 10)}...
            </Badge>
          ) : (
            <Badge variant="destructive">Not Connected</Badge>
          )}
        </div>
        <div>
          <strong>Wallet:</strong>{" "}
          {wallet ? (
            <Badge variant="default">
              {wallet.id}
            </Badge>
          ) : (
            <Badge variant="secondary">No wallet</Badge>
          )}
        </div>
        <div>
          <strong>Expected Chain:</strong> {activeChain.name} (ID: {activeChain.id})
        </div>
        <div>
          <strong>Chain ID from env:</strong> {process.env.NEXT_PUBLIC_CHAIN_ID}
        </div>
      </CardContent>
    </Card>
  );
}
