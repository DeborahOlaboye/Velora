"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "@/config/thirdweb";
import { activeChain, CUSD_TOKEN_ADDRESS } from "@/lib/thirdweb";
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
      options: [
        "email",
        "google",
        "apple",
        "facebook",
        "phone",
      ],
    },
  }),
];

export function ConnectWalletButton() {
  return (
    <ConnectButton
      client={client}
      chain={activeChain}
      wallets={wallets}
      connectButton={{
        label: "Connect Wallet",
        className:
          "!bg-gradient-to-r !from-blue-600 !to-indigo-600 !text-white !font-semibold !px-8 !py-3 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-200 hover:!scale-105",
      }}
      connectModal={{
        size: "wide",
        title: "Connect to Velora",
        titleIcon:
          "https://raw.githubusercontent.com/celo-org/celo-monorepo/master/packages/docs/static/img/celo-logo.png",
        showThirdwebBranding: false,
        welcomeScreen: {
          title: "Welcome to Velora",
          subtitle:
            "Connect your wallet to join the mutual aid network for gig workers on Celo",
        },
      }}
      detailsButton={{
        displayBalanceToken: {
          [activeChain.id]: CUSD_TOKEN_ADDRESS,
        },
      }}
      supportedTokens={{
        [activeChain.id]: [
          {
            address: CUSD_TOKEN_ADDRESS,
            name: "Celo Dollar",
            symbol: "cUSD",
            icon: "https://raw.githubusercontent.com/celo-org/celo-monorepo/master/packages/docs/static/img/celo-logo.png",
          },
        ],
      }}
    />
  );
}
