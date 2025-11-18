import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/thirdweb-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Velora - Mutual Aid for the Modern Worker",
  description: "A decentralized platform where gig workers collectively pool resources for emergency funds. Powered by Celo, Self Protocol, and GoodDollar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
