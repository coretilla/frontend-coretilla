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
import { Info, History } from "lucide-react";
import Image from "next/image";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import {
  BalanceHeaders,
  Overview,
  StakeForm,
  UnstakeCard,
  UnstakeDialog,
  HistorySection,
  useStakeUi,
} from "../_components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StakeMain() {
  const { isConnected } = useWallet();
  const {
    isAuthenticated,
    signIn,
    isAuthenticating,
    error: authError,
  } = useAuth();
  const ui = useStakeUi();

  if (!isConnected) {
    return (
      <PageWrapper
        title={<HeaderTitle />}
        subtitle="Connect your wallet to start staking and earning rewards."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <GateCard
          title="Connect Wallet Required"
          desc="Please connect your wallet to access staking functionality."
        >
          <ConnectWallet
            variant="default"
            size="lg"
            className="w-full max-w-sm mx-auto"
          />
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="font-sans">
              You need to connect your wallet first to stake your assets.
            </AlertDescription>
          </Alert>
        </GateCard>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper
        title={<HeaderTitle />}
        subtitle="Sign in with your wallet to start staking."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <GateCard
          title="Authentication Required"
          desc="Please sign in with your wallet to access staking functionality."
        >
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
        </GateCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={<HeaderTitle />}
      subtitle="Stake your Bitcoin to earn rewards"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-4xl mx-auto">
        <BalanceHeaders
          mBTCBalance={ui.mBTCBalance}
          stakedAmount={ui.stakedAmount}
          pendingRewards={ui.pendingRewards}
          onClaim={ui.handleClaimRewards}
          disabled={
            ui.isPending ||
            ui.isConfirming ||
            parseFloat(ui.pendingRewards) === 0
          }
        />
        <Overview
          apy={ui.apy}
          stakedAmount={ui.stakedAmount}
          pendingRewards={ui.pendingRewards}
          cooldownPeriod={ui.cooldownPeriod}
        />

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Staking & History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={ui.activeTab} onValueChange={ui.setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="staking"
                  className="font-sans cursor-pointer"
                >
                  Staking
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="font-sans flex items-center gap-2 cursor-pointer"
                >
                  <History className="h-4 w-4" />
                  Staking History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="staking" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StakeForm
                    mBTCBalance={ui.mBTCBalance}
                    apy={ui.apy}
                    yearlyRewards={ui.yearlyRewards}
                    formData={{ mBtcAmount: ui.formData.mBtcAmount }}
                    setFormData={(d) =>
                      ui.setFormData({ ...ui.formData, ...d })
                    }
                    onSubmit={ui.handleStakeSubmit}
                    isPending={ui.isPending}
                    isConfirming={ui.isConfirming}
                    needsApproval={ui.needsApproval}
                    pendingStakeAmount={ui.pendingStakeAmount}
                  />

                  <UnstakeCard
                    canUnstake={ui.canUnstake}
                    cooldownPeriod={ui.cooldownPeriod}
                    cooldownEnd={ui.cooldownEnd}
                    stakedAmount={ui.stakedAmount}
                    onOpen={() => ui.setShowUnstakeDialog(true)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <HistorySection
                  history={ui.history}
                  isLoading={ui.historyLoading}
                  error={ui.historyError}
                  onSignIn={signIn}
                  isAuthenticating={isAuthenticating}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <UnstakeDialog
          open={ui.showUnstakeDialog}
          onOpenChange={ui.setShowUnstakeDialog}
          canUnstake={ui.canUnstake}
          cooldownPeriod={ui.cooldownPeriod}
          stakedAmount={ui.stakedAmount}
          formData={{ unstakeAmount: ui.formData.unstakeAmount }}
          setFormData={(d) => ui.setFormData({ ...ui.formData, ...d })}
          onSubmit={ui.handleUnstakeSubmit}
          disabled={ui.isPending || ui.isConfirming}
        />
      </div>
    </PageWrapper>
  );
}

function HeaderTitle() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/image/btcLogo.png"
        alt="Bitcoin"
        width={60}
        height={40}
        className="object-contain"
      />
      <span>Bitcoin Staking</span>
    </div>
  );
}

function GateCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">{title}</CardTitle>
          <CardDescription className="font-sans">{desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">{children}</CardContent>
      </Card>
    </div>
  );
}
