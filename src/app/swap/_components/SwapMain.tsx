"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { useAuth } from "@/hooks/useAuth";
import { Balance, SwapForm, ConfirmDialog, useSwap } from "../_components"

export default function SwapMain() {
  const { isConnected } = useWallet();
  const {
    isAuthenticated,
    signIn,
    isAuthenticating,
    error: authError,
  } = useAuth();

  const {
    formData,
    setFormData,
    btcPrice,
    btcAmount,
    currentBalances,
    isLoading,
    showConfirmation,
    setShowConfirmation,
    networkFee,
    estimatedTime,
    handleSubmit,
    handleConfirmSwap,
  } = useSwap();

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", rate: btcPrice },
  ];
  const selectedCurrency = currencies[0];

  if (!isConnected) {
    return (
      <PageWrapper
        title="Buy Bitcoin with USD"
        subtitle="Connect your wallet to start swapping currencies."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Connect Wallet Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please connect your wallet to access swap functionality.
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
                  You need to connect your wallet first to swap currencies.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper
        title="Swap USD to Bitcoin"
        subtitle="Sign in with your wallet to start swapping."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Authentication Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please sign in with your wallet to access swap functionality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="font-sans text-red-600">
                    {authError}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                onClick={signIn}
                disabled={isAuthenticating}
                className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
              >
                {isAuthenticating ? "Signing in..." : "Sign in with Wallet"}
              </Button>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You'll be asked to sign a message with your wallet to
                  authenticate.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Swap USD to Bitcoin"
      subtitle="Convert your fiat currency to Bitcoin on Core Network"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-2xl mx-auto">
        <Balance balances={currentBalances} />
        <SwapForm
          currencies={currencies}
          selectedCurrency={selectedCurrency}
          currentBalance={currentBalances.USD}
          formData={formData}
          setFormData={setFormData}
          btcAmount={btcAmount}
          networkFee={networkFee}
          estimatedTime={estimatedTime}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
        <ConfirmDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          symbol={selectedCurrency.symbol}
          amount={formData.amount}
          btcAmount={btcAmount}
          networkFee={networkFee}
          estimatedTime={estimatedTime}
          onConfirm={handleConfirmSwap}
        />
      </div>
    </PageWrapper>
  );
}
