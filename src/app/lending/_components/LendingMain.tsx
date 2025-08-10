"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useLending } from "@/hooks/useLending";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLendingHistory, getLoanHistory } from "@/app/api/api";
import { BalanceCards, HealthMetrics, DepositTab, BorrowTab, WithdrawTab, RepayTab, TransactionHistory, WalletNotConnected, AuthRequired } from "../_components"

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

  if (!isConnected) {
    return <WalletNotConnected />;
  }

  if (!isAuthenticated) {
    return (
      <AuthRequired
        authError={authError}
        onSignIn={signIn}
        isAuthenticating={isAuthenticating}
      />
    );
  }

  return (
    <PageWrapper
      title="Lending & Borrowing"
      subtitle="Use Bitcoin as collateral to borrow USDT"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-6xl mx-auto">
        <BalanceCards
          mBTCBalance={lending.mBTCBalance}
          mUSDTBalance={lending.mUSDTBalance}
          collateralBalance={lending.collateralBalance}
          borrowedBalance={lending.borrowedBalance}
        />

        <HealthMetrics
          healthFactor={lending.healthFactor}
          ltvRatio={ltvRatio}
          maxLoanToValueRatio={lending.loanToValueRatio}
        />

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Lending Operations</CardTitle>
            <CardDescription className="font-sans">
              Deposit Bitcoin as collateral, borrow USDT, or manage your
              positions
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

              <TabsContent value="deposit">
                <DepositTab
                  collateralAmount={collateralAmount}
                  onCollateralAmountChange={setCollateralAmount}
                  mBTCBalance={lending.mBTCBalance}
                  isPending={lending.isPending}
                  isConfirming={lending.isConfirming}
                  needsMBTCApproval={lending.needsMBTCApproval}
                  onSubmit={handleDepositCollateral}
                />
              </TabsContent>

              <TabsContent value="borrow">
                <BorrowTab
                  borrowAmount={borrowAmount}
                  onBorrowAmountChange={setBorrowAmount}
                  maxBorrowAmount={lending.maxBorrowAmount}
                  collateralBalance={lending.collateralBalance}
                  isPending={lending.isPending}
                  isConfirming={lending.isConfirming}
                  onSubmit={handleBorrow}
                />
              </TabsContent>

              <TabsContent value="withdraw">
                <WithdrawTab
                  withdrawAmount={withdrawAmount}
                  onWithdrawAmountChange={setWithdrawAmount}
                  collateralBalance={lending.collateralBalance}
                  isPending={lending.isPending}
                  isConfirming={lending.isConfirming}
                  onSubmit={handleWithdraw}
                />
              </TabsContent>

              <TabsContent value="repay">
                <RepayTab
                  repayAmount={repayAmount}
                  onRepayAmountChange={setRepayAmount}
                  borrowedBalance={lending.borrowedBalance}
                  isPending={lending.isPending}
                  isConfirming={lending.isConfirming}
                  needsMUSDTApproval={lending.needsMUSDTApproval}
                  onSubmit={handleRepay}
                />
              </TabsContent>

              <TabsContent value="history">
                <TransactionHistory
                  isLoading={isLoadingHistory}
                  depositHistory={depositHistory}
                  loanHistory={loanHistory}
                />
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
