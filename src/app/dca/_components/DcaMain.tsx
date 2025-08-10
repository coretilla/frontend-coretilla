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
import { DollarSign } from "lucide-react";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { InfoStrip, PriceBalance, Explainer, StrategyForm, ProjectionCard, SimulationTable, useDcaUi } from "../_components";

export default function DcaMain() {
  const { isConnected } = useWallet();
  const {
    isAuthenticated,
    signIn,
    isAuthenticating,
    error: authError,
  } = useAuth();
  const ui = useDcaUi();

  if (!isConnected) {
    return (
      <PageWrapper
        title="DCA BTC Simulation"
        subtitle="Connect your wallet to simulate Bitcoin dollar-cost averaging."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <GateCard
          title="Connect Wallet Required"
          desc="Please connect your wallet to access the DCA simulation."
        >
          <ConnectWallet
            variant="default"
            size="lg"
            className="w-full max-w-sm mx-auto"
          />
          <Alert className="mt-4">
            <DollarSign className="h-4 w-4" />
            <AlertDescription className="font-sans">
              You need to connect your wallet first to run the DCA simulation.
            </AlertDescription>
          </Alert>
        </GateCard>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper
        title="DCA BTC Simulation"
        subtitle="Sign in with your wallet to run Bitcoin dollar-cost averaging simulation."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <GateCard
          title="Authentication Required"
          desc="Please sign in with your wallet to access the DCA simulation."
        >
          {authError && (
            <Alert>
              <DollarSign className="h-4 w-4" />
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
            <DollarSign className="h-4 w-4" />
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
      title="DCA BTC Simulation"
      subtitle="Simulate Bitcoin dollar-cost averaging with historical price data"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-4xl mx-auto">
        <InfoStrip />
        <PriceBalance
          isLoadingPrice={ui.isLoadingPrice}
          currentBtcPrice={ui.currentBtcPrice}
          priceChangeText={ui.formatPriceChange(ui.priceChange)}
          formatPrice={ui.formatPrice}
          isLoadingBalance={ui.isLoadingBalance}
          usdBalance={ui.userBalance.USD || 0}
        />
        <Explainer startingPrice={ui.formatPrice(ui.currentBtcPrice)} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StrategyForm {...ui} onSubmit={ui.handleSubmit} />
          <ProjectionCard
            projection={ui.projection}
            selectedCurrency={ui.selectedCurrency}
            formatPrice={ui.formatPrice}
            yearlyGrowthPrediction={ui.yearlyGrowthPrediction}
            duration={ui.projection?.duration}
          />
        </div>

        <SimulationTable
          results={ui.simulationResults}
          formatPrice={ui.formatPrice}
          symbol={ui.selectedCurrency?.symbol}
          yearlyGrowthPrediction={ui.yearlyGrowthPrediction}
          currentBtcPrice={ui.currentBtcPrice}
        />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans">About This Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <AboutBullets />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
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

function AboutBullets() {
  const bullets = [
    {
      h: "Growth-Based Projections",
      p: "Uses live BTC price with customizable annual growth predictions (5%-100%)",
    },
    {
      h: "Risk-Free Testing",
      p: "Test your DCA strategy without using real money",
    },
    {
      h: "Detailed Analytics",
      p: "See month-by-month breakdown of your simulation",
    },
    {
      h: "Multiple Growth Scenarios",
      p: "Test conservative (5%) to aggressive (100%) BTC growth scenarios",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bullets.map((b) => (
        <div key={b.h} className="flex items-start gap-3">
          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
          <div>
            <div className="font-medium font-sans">{b.h}</div>
            <div className="text-sm text-muted-foreground font-sans">{b.p}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
