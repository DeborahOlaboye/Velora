"use client";

import { ReactNode } from "react";
import { ThirdwebProvider, AutoConnect } from "thirdweb/react";
import { client, activeChain } from "@/lib/thirdweb-client";
import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.zerion.wallet"),
  createWallet("app.phantom"),
  createWallet("com.trustwallet.app"),
  createWallet("inApp", {
    auth: {
      options: ["email", "google", "apple", "facebook", "phone"],
    },
  }),
];

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <ThirdwebProvider>
      <AutoConnect
        client={client}
        wallets={wallets}
        timeout={15000}
      />
      {children}
    </ThirdwebProvider>
  );
}
