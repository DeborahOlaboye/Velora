"use client";

import { ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}
