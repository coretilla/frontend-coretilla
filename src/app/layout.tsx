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
  description: "Simple, secure, and designed for everyone - from crypto beginners to CoreDAO veterans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <JotaiProvider>
          <WalletProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster />
          </WalletProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}