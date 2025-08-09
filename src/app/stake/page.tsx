"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Info,
  Zap,
  Clock,
  History,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStaking } from "@/hooks/useStaking";
import { useStakingHistory } from "@/hooks/useStakingHistory";
import { useYearlyRewards } from "@/hooks/useYearlyRewards";

interface StakeFormData {
  mBtcAmount: string;
  unstakeAmount: string;
}

export default function StakePage() {
  const { isConnected } = useWallet();
  const {
    isAuthenticated,
    signIn,
    isAuthenticating,
    error: authError,
  } = useAuth();

  const [formData, setFormData] = useState<StakeFormData>({
    mBtcAmount: "",
    unstakeAmount: "",
  });

  const [activeTab, setActiveTab] = useState("staking");
  const [showUnstakeDialog, setShowUnstakeDialog] = useState(false);
  const [pendingStakeAmount, setPendingStakeAmount] = useState<string | null>(
    null
  );

  const {
    approve,
    stake,
    startCooldown,
    unstake,
    claimRewards,
    needsApproval,
    refetchAll,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    mBTCBalance,
    apy,
    cooldownPeriod,
    stakedAmount,
    pendingRewards,
    canUnstake,
    cooldownEnd,
  } = useStaking();

  const {
    history,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useStakingHistory();

  const { yearlyRewards } = useYearlyRewards(formData.mBtcAmount);

  const [processedHash, setProcessedHash] = useState<string | null>(null);

  useEffect(() => {
    const handleStakeAfterApproval = async () => {
      if (isConfirmed && pendingStakeAmount && hash && hash !== processedHash) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success("Approval confirmed! Now staking...");
          await stake(pendingStakeAmount);
          setPendingStakeAmount(null);
          setProcessedHash(hash);
        } catch (error) {
          console.error("Staking after approval error:", error);
          toast.error("Failed to stake after approval");
          setPendingStakeAmount(null);
          setProcessedHash(hash);
        }
      }
    };
    handleStakeAfterApproval();
  }, [isConfirmed, pendingStakeAmount, hash, processedHash, stake]);

  useEffect(() => {
    if (isConfirmed && hash && hash !== processedHash && !pendingStakeAmount) {
      refetchAll();
      refetchHistory();
      setFormData({ mBtcAmount: "", unstakeAmount: "" });
      toast.success("Transaction confirmed successfully!");
      setProcessedHash(hash);
    }
  }, [
    isConfirmed,
    hash,
    processedHash,
    pendingStakeAmount,
    refetchAll,
    refetchHistory,
  ]);

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mBtcAmount || parseFloat(formData.mBtcAmount) <= 0) {
      toast.error("Please enter a valid Bitcoin amount");
      return;
    }

    if (parseFloat(formData.mBtcAmount) > parseFloat(mBTCBalance)) {
      toast.error("Insufficient Bitcoin balance");
      return;
    }

    try {
      if (needsApproval(formData.mBtcAmount)) {
        toast.info("Step 1/2: Approving Bitcoin for staking...");
        setPendingStakeAmount(formData.mBtcAmount);
        await approve(formData.mBtcAmount);
        return;
      }

      toast.info("Staking Bitcoin...");
      await stake(formData.mBtcAmount);
    } catch (error) {
      console.error("Staking error:", error);
      toast.error("Failed to stake Bitcoin");
      setPendingStakeAmount(null);
    }
  };

  const handleUnstakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unstakeAmount || parseFloat(formData.unstakeAmount) <= 0) {
      toast.error("Please enter a valid unstake amount");
      return;
    }
    if (parseFloat(formData.unstakeAmount) > parseFloat(stakedAmount)) {
      toast.error("Insufficient staked amount");
      return;
    }
    try {
      if (!canUnstake) {
        await startCooldown();
        toast.info(
          "Cooldown started. You can unstake after the cooldown period."
        );
        setShowUnstakeDialog(false);
        return;
      }
      await unstake(formData.unstakeAmount);
      toast.info("Unstaking transaction submitted...");
      setShowUnstakeDialog(false);
    } catch (error) {
      console.error("Unstaking error:", error);
      toast.error("Failed to unstake");
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
      toast.info("Claim rewards transaction submitted...");
    } catch (error) {
      console.error("Claim rewards error:", error);
      toast.error("Failed to claim rewards");
    }
  };

  if (!isConnected) {
    return (
      <PageWrapper
        title={
          <div className="flex items-center justify-center">
            <Image
              src="/image/btcLogo.png"
              alt="Bitcoin"
              width={40}
              height={40}
              className="object-contain"
            />
            <span>Bitcoin Staking</span>
          </div>
        }
        subtitle="Connect your wallet to start staking and earning rewards."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Connect Wallet Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please connect your wallet to access staking functionality.
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
                  You need to connect your wallet first to stake your assets.
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
        title={
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
        }
        subtitle="Sign in with your wallet to start staking."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Authentication Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please sign in with your wallet to access staking functionality.
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
      title={
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
      }
      subtitle="Stake your Bitcoin to earn rewards"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-sans flex items-center">
                <Image
                  src="/image/btcLogo.png"
                  alt="Bitcoin"
                  width={40}
                  height={20}
                  className="object-contain"
                />
                Bitcoin Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-foreground">
                {parseFloat(mBTCBalance).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground font-sans">
                Available
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Staked Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-foreground">
                {parseFloat(stakedAmount).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground font-sans">
                Bitcoin Staked
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                Pending Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-green-600">
                {parseFloat(pendingRewards).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground font-sans">
                <Button
                  onClick={handleClaimRewards}
                  size="sm"
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 p-0 h-auto"
                  disabled={
                    isPending ||
                    isConfirming ||
                    parseFloat(pendingRewards) === 0
                  }
                >
                  Claim Rewards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans">Staking Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">
                  {(apy * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  APY
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground font-mono">
                  {parseFloat(stakedAmount).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Your Staked
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-mono">
                  {parseFloat(pendingRewards).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Pending Rewards
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground font-mono">
                  {Math.floor(cooldownPeriod / 86400)}d
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Cooldown
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Staking & History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="staking" className="font-sans cursor-pointer">
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
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold font-sans mb-2">
                        Stake Bitcoin
                      </h3>
                      <p className="text-muted-foreground font-sans text-sm">
                        Stake your Bitcoin to earn rewards
                      </p>
                    </div>

                    <form onSubmit={handleStakeSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="mBtcAmount"
                          className="font-sans font-medium"
                        >
                          Bitcoin Amount
                        </Label>
                        <div className="relative">
                          <Input
                            id="mBtcAmount"
                            type="number"
                            placeholder="0.00000000"
                            value={formData.mBtcAmount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mBtcAmount: e.target.value,
                              })
                            }
                            className="font-mono"
                            step="0.00000001"
                            max={mBTCBalance}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                mBtcAmount: mBTCBalance,
                              })
                            }
                          >
                            Max
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground font-sans">
                          Available: {parseFloat(mBTCBalance).toFixed(1)}{" "}
                          Bitcoin
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium font-sans">
                            Estimated Yearly Rewards
                          </span>
                        </div>
                        <div className="text-lg font-bold text-green-600 font-mono">
                          {parseFloat(yearlyRewards || "0").toFixed(1)} Bitcoin
                        </div>
                        <div className="text-sm text-muted-foreground font-sans">
                          APY: {(apy * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground font-sans mt-1">
                          * Calculated from smart contract
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 font-sans font-semibold cursor-pointer"
                        disabled={isPending || isConfirming}
                      >
                        {isPending
                          ? pendingStakeAmount
                            ? "Approving..."
                            : "Processing..."
                          : isConfirming
                          ? pendingStakeAmount
                            ? "Confirming Approval..."
                            : "Confirming..."
                          : needsApproval(formData.mBtcAmount)
                          ? "Approve & Stake"
                          : "Stake Bitcoin"}
                      </Button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold font-sans mb-2">
                        Unstake Bitcoin
                      </h3>
                      <p className="text-muted-foreground font-sans text-sm">
                        Unstake your Bitcoin
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium font-sans">
                            Unstaking Status
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground font-sans">
                          {canUnstake ? (
                            <span className="text-green-600">
                              ✓ Ready to unstake
                            </span>
                          ) : (
                            <span className="text-orange-600">
                              ⏳ Cooldown required
                            </span>
                          )}
                        </div>
                        {cooldownEnd > 0 && (
                          <div className="text-sm text-muted-foreground font-sans">
                            Cooldown ends:{" "}
                            {new Date(cooldownEnd * 1000).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => setShowUnstakeDialog(true)}
                        className="w-full bg-orange-600 hover:bg-orange-700 font-sans font-semibold cursor-pointer"
                        disabled={
                          isPending ||
                          isConfirming ||
                          parseFloat(stakedAmount) === 0
                        }
                      >
                        {canUnstake ? "Unstake Bitcoin" : "Start Cooldown"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Staking History
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    View your past staking transactions
                  </p>
                </div>

                {historyLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground font-sans text-sm mt-2">
                      Loading history...
                    </p>
                  </div>
                ) : historyError ? (
                  <Alert
                    variant={
                      historyError.includes("Backend configuration")
                        ? "destructive"
                        : "default"
                    }
                  >
                    <Info className="h-4 w-4" />
                    <AlertDescription className="font-sans">
                      {historyError}
                      {historyError.includes("Authentication") && (
                        <div className="mt-2">
                          <Button
                            onClick={() => signIn()}
                            size="sm"
                            variant="outline"
                            disabled={isAuthenticating}
                          >
                            {isAuthenticating
                              ? "Signing in..."
                              : "Sign In to View History"}
                          </Button>
                        </div>
                      )}
                      {historyError.includes("Backend configuration") && (
                        <div className="mt-2 text-sm">
                          <p>
                            This is a backend configuration issue. The staking
                            vault address needs to be configured:
                          </p>
                          <code className="block mt-1 p-2 bg-muted rounded text-xs">
                            StakingVault:
                            0x3EF7d600DB474F1a544602Bd7dA33c53d98B7B1b
                          </code>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground font-sans">
                      No staking history found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium font-sans">
                                Stake Bitcoin
                              </div>
                              <div className="text-sm text-muted-foreground font-mono">
                                Block: {item.blockNumber}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold font-mono flex items-center justify-center">
                                {parseFloat(item.amount).toFixed(1)} BTC
                                <Image
                                  src="/image/btcLogo.png"
                                  alt="Bitcoin"
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                              <a
                                href={`https://scan.coredao.org/tx/${item.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline font-mono flex items-center gap-1"
                              >
                                View your transaction hash{" "}
                                <ChevronRight className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={showUnstakeDialog} onOpenChange={setShowUnstakeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                Unstake Bitcoin
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUnstakeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="unstakeAmount"
                  className="font-sans font-medium"
                >
                  Amount to Unstake
                </Label>
                <div className="relative">
                  <Input
                    id="unstakeAmount"
                    type="number"
                    placeholder="0.00000000"
                    value={formData.unstakeAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unstakeAmount: e.target.value,
                      })
                    }
                    className="font-mono"
                    step="0.00000001"
                    max={stakedAmount}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                    onClick={() =>
                      setFormData({ ...formData, unstakeAmount: stakedAmount })
                    }
                  >
                    Max
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Staked: {parseFloat(stakedAmount).toFixed(1)} Bitcoin
                </div>
              </div>

              {!canUnstake && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="font-sans">
                    You need to start cooldown before unstaking. This will start
                    the {Math.floor(cooldownPeriod / 86400)} day cooldown
                    period.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUnstakeDialog(false)}
                  className="flex-1 font-sans font-medium cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 font-sans font-semibold cursor-pointer"
                  disabled={isPending || isConfirming}
                >
                  {canUnstake ? "Unstake" : "Start Cooldown"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
