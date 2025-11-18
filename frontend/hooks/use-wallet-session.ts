"use client";

import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { useEffect, useState } from "react";

export interface WalletSession {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  disconnect: () => void;
  chainId: number | undefined;
}

export function useWalletSession(): WalletSession {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  // Track wallet connection state
  useEffect(() => {
    if (wallet) {
      setIsConnecting(false);
    }
  }, [wallet]);

  // Persist session in localStorage
  useEffect(() => {
    if (account?.address) {
      localStorage.setItem("wallet_session", JSON.stringify({
        address: account.address,
        chainId: account.chainId,
        timestamp: Date.now(),
      }));
    } else {
      localStorage.removeItem("wallet_session");
    }
  }, [account]);

  const handleDisconnect = () => {
    disconnect(wallet);
    localStorage.removeItem("wallet_session");
  };

  return {
    address: account?.address,
    isConnected: !!account,
    isConnecting,
    disconnect: handleDisconnect,
    chainId: account?.chainId,
  };
}

// Hook to check if user has a previous session
export function usePreviousSession() {
  const [previousSession, setPreviousSession] = useState<{
    address: string;
    chainId: number;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("wallet_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        // Only restore session if less than 7 days old
        if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setPreviousSession(parsed);
        } else {
          localStorage.removeItem("wallet_session");
        }
      } catch (error) {
        console.error("Failed to parse wallet session:", error);
        localStorage.removeItem("wallet_session");
      }
    }
  }, []);

  return previousSession;
}
