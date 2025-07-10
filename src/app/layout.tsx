import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { BTCPriceProvider } from "@/contexts/BTCPriceContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bitcoin Neobank - Your Digital Bank for Bitcoin",
  description: "Simple, secure, and designed for everyone - from crypto beginners to Bitcoin veterans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <BTCPriceProvider>
            {children}
            <Toaster />
          </BTCPriceProvider>
        </WalletProvider>
      </body>
    </html>
  );
}