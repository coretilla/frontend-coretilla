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
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Coins } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useLending } from "@/hooks/useLending";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLendingHistory, getLoanHistory } from "@/lib/api";

const formatHealthFactor = (value: number): string => {
  if (!value || isNaN(value)) return "0.00";
  if (value > 999999) return "999+";
  return value.toFixed(2);
};

export default function LendingPage() {
  const { isConnected } = useWallet();
  const {
    isAuthenticated,
    signIn,
    isAuthenticating,
    error: authError,
  } = useAuth();
  const lending = useLending();

  const [collateralAmount, setCollateralAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [fundPoolAmount, setFundPoolAmount] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [depositHistory, setDepositHistory] = useState<any[]>([]);
  const [loanHistory, setLoanHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && isAuthenticated) {
      lending.refetchAll();
    }
  }, [isConnected, isAuthenticated, lending.isConfirmed]);

  useEffect(() => {
    if (lending.isConfirmed && lastAction) {
      switch (lastAction) {
        case "deposit":
          toast.success("Collateral deposited successfully!");
          setCollateralAmount("");
          break;
        case "borrow":
          toast.success("USDT borrowed successfully!");
          setBorrowAmount("");
          break;
        case "withdraw":
          toast.success("Collateral withdrawn successfully!");
          setWithdrawAmount("");
          break;
        case "repay":
          toast.success("Loan repaid successfully!");
          setRepayAmount("");
          break;
        default:
          break;
      }
      setLastAction(null);
    }
  }, [lending.isConfirmed, lastAction]);

  const fetchHistory = async () => {
    if (!isConnected || !isAuthenticated) return;

    setIsLoadingHistory(true);
    try {
      const [depositResult, loanResult] = await Promise.all([
        getLendingHistory(),
        getLoanHistory(),
      ]);

      if (depositResult.success) {
        setDepositHistory(depositResult.data);
      }

      if (loanResult.success) {
        setLoanHistory(loanResult.data);
      }

      if (!depositResult.success && !loanResult.success) {
        toast.error("Failed to load transaction history");
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load transaction history");
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, isConnected, isAuthenticated]);

  const currentLTV = () => {
    if (
      !lending.collateralBalance ||
      !lending.borrowedBalance ||
      !lending.btcPriceInUSDT
    )
      return 0;

    const collateralValue =
      parseFloat(lending.collateralBalance) *
      parseFloat(lending.btcPriceInUSDT);
    const borrowedValue = parseFloat(lending.borrowedBalance);

    if (collateralValue === 0) return 0;
    return (borrowedValue / collateralValue) * 100;
  };

  const handleDepositCollateral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collateralAmount) {
      toast.error("Please enter collateral amount");
      return;
    }

    if (parseFloat(collateralAmount) > parseFloat(lending.mBTCBalance)) {
      toast.error("Insufficient Bitcoin balance");
      return;
    }

    try {
      if (lending.needsMBTCApproval(collateralAmount)) {
        toast.info("Approving Bitcoin for lending pool...");
        await lending.approveMBTC(collateralAmount);
        return;
      }

      toast.info("Depositing collateral...");
      await lending.depositCollateral(collateralAmount);
      setLastAction("deposit");
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowAmount) {
      toast.error("Please enter borrow amount");
      return;
    }

    const maxBorrow = parseFloat(lending.maxBorrowAmount);
    if (parseFloat(borrowAmount) > maxBorrow) {
      toast.error(`Maximum borrow amount is ${maxBorrow.toFixed(6)} USDT`);
      return;
    }

    try {
      if (lending.needsMUSDTApproval(borrowAmount)) {
        toast.info("Approving USDT for lending pool...");
        await lending.approveMUSDT(borrowAmount);
        return;
      }

      toast.info("Borrowing USDT...");
      await lending.borrowUSDT(borrowAmount);
      setLastAction("borrow");
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) {
      toast.error("Please enter withdraw amount");
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(lending.collateralBalance)) {
      toast.error("Insufficient collateral balance");
      return;
    }

    try {
      toast.info("Withdrawing collateral...");
      await lending.withdrawCollateral(withdrawAmount);
      setLastAction("withdraw");
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
    }
  };

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayAmount) {
      toast.error("Please enter repay amount");
      return;
    }

    if (parseFloat(repayAmount) > parseFloat(lending.mUSDTBalance)) {
      toast.error("Insufficient USDT balance");
      return;
    }

    try {
      if (lending.needsMUSDTApproval(repayAmount)) {
        toast.info("Approving USDT for lending pool...");
        await lending.approveMUSDT(repayAmount);
        return;
      }

      toast.info("Repaying loan...");
      await lending.repayUSDT(repayAmount);
      setLastAction("repay");
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
    }
  };

  const ltvRatio = currentLTV();

  const handleFundPool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundPoolAmount) {
      toast.error("Please enter fund pool amount");
      return;
    }

    if (parseFloat(fundPoolAmount) > parseFloat(lending.mUSDTBalance)) {
      toast.error("Insufficient USDT balance");
      return;
    }

    try {
      if (lending.needsMUSDTApproval(fundPoolAmount)) {
        toast.info("Approving USDT for lending pool...");
        await lending.approveMUSDT(fundPoolAmount);
        return;
      }

      await lending.fundPool(fundPoolAmount);
      toast.success("Pool funded successfully!");
      setFundPoolAmount("");
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
    }
  };

  const handleMintMUSDT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintAmount || !mintAddress) {
      toast.error("Please enter both amount and address");
      return;
    }

    try {
      await lending.mintMUSDT(mintAddress, mintAmount);
      toast.success("USDT minted successfully!");
      setMintAmount("");
      setMintAddress("");
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
    }
  };

  if (!isConnected) {
    return (
      <PageWrapper
        title="Lending & Borrowing"
        subtitle="Connect your wallet to start lending and borrowing assets."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Connect Wallet Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please connect your wallet to access lending and borrowing
                functionality.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ConnectWallet
                variant="default"
                size="lg"
                className="w-full max-w-sm mx-auto"
              />
              <Alert className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You need to connect your wallet first to lend or borrow
                  assets.
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
        title="Lending & Borrowing"
        subtitle="Sign in with your wallet to start lending and borrowing."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">
                Authentication Required
              </CardTitle>
              <CardDescription className="font-sans">
                Please sign in with your wallet to access lending and borrowing
                functionality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <Alert>
                  <Shield className="h-4 w-4" />
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
                <Shield className="h-4 w-4" />
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
      title="Lending & Borrowing"
      subtitle="Use Bitcoin as collateral to borrow USDT"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/image/btcLogo.png"
                  alt="Bitcoin"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <CardTitle className="text-sm font-sans">
                  Bitcoin Balance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {parseFloat(lending.mBTCBalance).toFixed(8).replace(/\.?0+$/, '')}
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Available to deposit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm font-sans">
                  USDT Balance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {parseFloat(lending.mUSDTBalance).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Available to repay
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-sans">Collateral</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {parseFloat(lending.collateralBalance).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Bitcoin deposited
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-sm font-sans">Borrowed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {parseFloat(lending.borrowedBalance).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                USDT borrowed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Health Factor</CardTitle>
              <CardDescription className="font-sans">
                Higher is safer. Below 1.0 risks liquidation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold font-mono ${
                  lending.healthFactor < 1
                    ? "text-red-600"
                    : lending.healthFactor < 1.5
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {formatHealthFactor(lending.healthFactor)}
              </div>
              <Progress
                value={Math.min(lending.healthFactor * 50, 100)}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Loan-to-Value Ratio</CardTitle>
              <CardDescription className="font-sans">
                Current: {ltvRatio.toFixed(1)}% | Max:{" "}
                {lending.loanToValueRatio}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold font-mono ${
                  ltvRatio > 80
                    ? "text-red-600"
                    : ltvRatio > 60
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {ltvRatio.toFixed(1)}%
              </div>
              <Progress value={ltvRatio} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Lending Operations</CardTitle>
            <CardDescription className="font-sans">
              Deposit Bitcoin as collateral, borrow USDT, or manage your positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="deposit" className="font-sans">
                  Deposit
                </TabsTrigger>
                <TabsTrigger value="borrow" className="font-sans">
                  Borrow
                </TabsTrigger>
                <TabsTrigger value="withdraw" className="font-sans">
                  Withdraw
                </TabsTrigger>
                <TabsTrigger value="repay" className="font-sans">
                  Repay
                </TabsTrigger>
                {/* <TabsTrigger value="fund" className="font-sans">Fund Pool</TabsTrigger> */}
                {/* <TabsTrigger value="mint" className="font-sans">Mint USDT</TabsTrigger> */}
                <TabsTrigger value="history" className="font-sans">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deposit" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Deposit Bitcoin Collateral
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Deposit Bitcoin to use as collateral for borrowing
                  </p>
                </div>

                <form onSubmit={handleDepositCollateral} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="collateral-amount"
                      className="font-sans font-medium"
                    >
                      Bitcoin Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="collateral-amount"
                        type="number"
                        placeholder="0.00000000"
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                        className="font-mono"
                        step="0.00000001"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() => setCollateralAmount(lending.mBTCBalance)}
                      >
                        Max
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Available: {parseFloat(lending.mBTCBalance).toFixed(8).replace(/\.?0+$/, '')}{" "}
                      Bitcoin
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 font-sans font-semibold"
                    disabled={
                      lending.isPending ||
                      lending.isConfirming ||
                      !collateralAmount
                    }
                  >
                    {lending.isPending || lending.isConfirming
                      ? lending.needsMBTCApproval(collateralAmount)
                        ? "Approving..."
                        : "Depositing..."
                      : lending.needsMBTCApproval(collateralAmount)
                      ? "Approve Bitcoin"
                      : "Deposit Collateral"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="borrow" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Borrow USDT
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Borrow USDT against your collateral
                  </p>
                </div>

                <form onSubmit={handleBorrow} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="borrow-amount"
                      className="font-sans font-medium"
                    >
                      USDT Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="borrow-amount"
                        type="number"
                        placeholder="0.00"
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                        className="font-mono"
                        step="0.01"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() => setBorrowAmount(lending.maxBorrowAmount)}
                      >
                        Max
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Max borrowable:{" "}
                      {parseFloat(lending.maxBorrowAmount).toFixed(2)} USDT
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 font-sans font-semibold"
                    disabled={
                      lending.isPending ||
                      lending.isConfirming ||
                      !borrowAmount ||
                      parseFloat(lending.collateralBalance) === 0
                    }
                  >
                    {lending.isPending || lending.isConfirming
                      ? "Borrowing..."
                      : "Borrow USDT"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="withdraw" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Withdraw Collateral
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Withdraw your Bitcoin collateral
                  </p>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="withdraw-amount"
                      className="font-sans font-medium"
                    >
                      Bitcoin Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="0.00000000"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="font-mono"
                        step="0.00000001"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() =>
                          setWithdrawAmount(lending.collateralBalance)
                        }
                      >
                        Max
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Deposited:{" "}
                      {parseFloat(lending.collateralBalance).toFixed(1)} Bitcoin
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 font-sans font-semibold"
                    disabled={
                      lending.isPending ||
                      lending.isConfirming ||
                      !withdrawAmount ||
                      parseFloat(lending.collateralBalance) === 0
                    }
                  >
                    {lending.isPending || lending.isConfirming
                      ? "Withdrawing..."
                      : "Withdraw Collateral"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="repay" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Repay Loan
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Repay your USDT loan to reduce debt
                  </p>
                </div>

                <form onSubmit={handleRepay} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="repay-amount"
                      className="font-sans font-medium"
                    >
                      USDT Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="repay-amount"
                        type="number"
                        placeholder="0.00"
                        value={repayAmount}
                        onChange={(e) => setRepayAmount(e.target.value)}
                        className="font-mono"
                        step="0.01"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() => setRepayAmount(lending.borrowedBalance)}
                      >
                        Max
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Borrowed: {parseFloat(lending.borrowedBalance).toFixed(2)}{" "}
                      USDT
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 font-sans font-semibold"
                    disabled={
                      lending.isPending ||
                      lending.isConfirming ||
                      !repayAmount ||
                      parseFloat(lending.borrowedBalance) === 0
                    }
                  >
                    {lending.isPending || lending.isConfirming
                      ? lending.needsMUSDTApproval(repayAmount)
                        ? "Approving..."
                        : "Repaying..."
                      : lending.needsMUSDTApproval(repayAmount)
                      ? "Approve USDT"
                      : "Repay Loan"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="fund" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Fund Pool
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Add USDT liquidity to the lending pool
                  </p>
                </div>

                <form onSubmit={handleFundPool} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fund-amount"
                      className="font-sans font-medium"
                    >
                      USDT Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="fund-amount"
                        type="number"
                        placeholder="0.00"
                        value={fundPoolAmount}
                        onChange={(e) => setFundPoolAmount(e.target.value)}
                        className="font-mono"
                        step="0.01"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() => setFundPoolAmount(lending.mUSDTBalance)}
                      >
                        Max
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Available: {parseFloat(lending.mUSDTBalance).toFixed(2)}{" "}
                      USDT
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-sans font-semibold"
                    disabled={
                      lending.isPending ||
                      lending.isConfirming ||
                      !fundPoolAmount
                    }
                  >
                    {lending.isPending || lending.isConfirming
                      ? lending.needsMUSDTApproval(fundPoolAmount)
                        ? "Approving..."
                        : "Funding Pool..."
                      : lending.needsMUSDTApproval(fundPoolAmount)
                      ? "Approve USDT"
                      : "Fund Pool"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="mint" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Mint USDT
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Mint new USDT tokens to an address
                  </p>
                </div>

                <form onSubmit={handleMintMUSDT} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="mint-address"
                      className="font-sans font-medium"
                    >
                      Recipient Address
                    </Label>
                    <Input
                      id="mint-address"
                      type="text"
                      placeholder="0x..."
                      value={mintAddress}
                      onChange={(e) => setMintAddress(e.target.value)}
                      className="font-mono"
                    />
                    <div className="text-sm text-muted-foreground font-sans">
                      Enter the address to mint USDT to
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="mint-amount"
                      className="font-sans font-medium"
                    >
                      USDT Amount
                    </Label>
                    <Input
                      id="mint-amount"
                      type="number"
                      placeholder="0.00"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      className="font-mono"
                      step="0.01"
                    />
                    <div className="text-sm text-muted-foreground font-sans">
                      Amount of USDT to mint
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 font-sans font-semibold"
                    disabled={
                      lending.isPending ||
                      lending.isConfirming ||
                      !mintAmount ||
                      !mintAddress
                    }
                  >
                    {lending.isPending || lending.isConfirming
                      ? "Minting..."
                      : "Mint USDT"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    Transaction History
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    View your lending and borrowing transaction history
                  </p>
                </div>

                <div className="space-y-4">
                  {isLoadingHistory ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-sans">
                          Loading transaction history...
                        </span>
                      </div>
                    </div>
                  ) : depositHistory.length > 0 || loanHistory.length > 0 ? (
                    <div className="space-y-3">
                      {depositHistory.map((deposit, index) => (
                        <Card key={`deposit-${index}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="font-semibold font-mono text-lg">
                                  {parseFloat(
                                    deposit.btcAmount || deposit.amount
                                  ).toFixed(8)}{" "}
                                  Bitcoin
                                </div>
                                <div className="text-sm text-muted-foreground font-sans">
                                  Block: {deposit.blockNumber}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  {deposit.transactionHash.slice(0, 10)}...
                                  {deposit.transactionHash.slice(-8)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-sans text-blue-600">
                                  Deposit Collateral
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    window.open(
                                      `https://scan.coredao.org/tx/${deposit.transactionHash}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  View on Explorer
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {loanHistory.map((loan, index) => (
                        <Card key={`loan-${index}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="font-semibold font-mono text-lg">
                                  {parseFloat(loan.amount).toFixed(2)} USDT
                                </div>
                                <div className="text-sm text-muted-foreground font-sans">
                                  Block: {loan.blockNumber}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  {loan.transactionHash.slice(0, 10)}...
                                  {loan.transactionHash.slice(-8)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-sans text-yellow-600">
                                  Loan USDT
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => {
                                    window.open(
                                      `https://scan.coredao.org/tx/${loan.transactionHash}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  View on Explorer
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground font-sans">
                        No transaction history found
                      </div>
                      <p className="text-sm text-muted-foreground font-sans mt-2">
                        Your lending and borrowing transactions will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {lending.isPending && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-sans">
              Transaction pending... Please confirm in your wallet.
            </AlertDescription>
          </Alert>
        )}

        {lending.isConfirming && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-sans">
              Transaction confirmed! Waiting for block confirmation...
            </AlertDescription>
          </Alert>
        )}
      </div>
    </PageWrapper>
  );
}
