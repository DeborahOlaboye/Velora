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
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  // Track wallet connection state and chain ID
  useEffect(() => {
    if (wallet) {
      setIsConnecting(false);
      // Get the chain from the wallet and extract the chain ID
      const chain = wallet.getChain();
      setChainId(chain ? Number(chain.id) : undefined);
    } else {
      setChainId(undefined);
    }
  }, [wallet]);

  // Persist session in localStorage
  useEffect(() => {
    if (account?.address) {
      localStorage.setItem("wallet_session", JSON.stringify({
        address: account.address,
        chainId: chainId,
        timestamp: Date.now(),
      }));
    } else {
      localStorage.removeItem("wallet_session");
    }
  }, [account, chainId]);

  const handleDisconnect = () => {
    if (wallet) {
      disconnect(wallet);
      localStorage.removeItem("wallet_session");
      setChainId(undefined);
    }
  };

  return {
    address: account?.address,
    isConnected: !!account,
    isConnecting,
    chainId: chainId,
    disconnect: handleDisconnect,
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
