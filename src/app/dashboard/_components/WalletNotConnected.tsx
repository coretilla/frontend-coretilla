import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import PageWrapper from "@/components/layout/PageWrapper";
import { Info } from "lucide-react";

export function WalletNotConnected() {
  return (
    <PageWrapper
      title="Portfolio Dashboard"
      subtitle="Connect your wallet to view your portfolio analytics."
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Connect Wallet Required</CardTitle>
            <CardDescription className="font-sans">
              Please connect your wallet to access your portfolio dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <ConnectWallet
              variant="default"
              size="lg"
              className="w-full max-w-sm mx-auto"
            />
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="font-sans">
                You need to connect your wallet first to view your portfolio.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}