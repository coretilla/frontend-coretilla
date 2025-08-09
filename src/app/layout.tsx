import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import JotaiProvider from "@/components/providers/JotaiProvider";
import MainLayout from "@/components/layout/MainLayout";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Coretilla - Your Digital Bank for CoreDAO",
  description:
    "Simple, secure, and designed for everyone - from crypto beginners to CoreDAO veterans.",
    icons: {
    icon: `/favicon.ico?v=${Date.now()}`,
    shortcut: `/favicon.ico?v=${Date.now()}`,
    apple: `/favicon.ico?v=${Date.now()}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/public/favicon.ico" sizes="any" />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <JotaiProvider>
          <WalletProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </WalletProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
