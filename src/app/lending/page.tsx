"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Shield, AlertTriangle, Percent } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LendingData {
  asset: string;
  amount: string;
  interestType: "fixed" | "variable";
}

interface BorrowingData {
  collateralAsset: string;
  borrowAsset: string;
  collateralAmount: string;
  borrowAmount: string;
}

export default function LendingPage() {
  const { isConnected } = useWallet();
  const { isAuthenticated, signIn, isAuthenticating, error: authError } = useAuth();
  
  const [lendingData, setLendingData] = useState<LendingData>({
    asset: "",
    amount: "",
    interestType: "fixed",
  });

  const [borrowingData, setBorrowingData] = useState<BorrowingData>({
    collateralAsset: "",
    borrowAsset: "",
    collateralAmount: "",
    borrowAmount: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const assets = [
    { symbol: "mockBTC", name: "Mock Bitcoin", balance: 0.00000000, apy: 8.5 },
    { symbol: "mockUSDT", name: "Mock Tether", balance: 0.00, apy: 12.0 },
    { symbol: "mockETH", name: "Mock Ethereum", balance: 0.00000000, apy: 6.8 },
  ];

  const lendingRates = {
    mockBTC: { fixed: 8.5, variable: 9.2 },
    mockUSDT: { fixed: 12.0, variable: 13.5 },
    mockETH: { fixed: 6.8, variable: 7.4 },
  };

  const borrowingRates = {
    mockBTC: 10.5,
    mockUSDT: 15.0,
    mockETH: 8.8,
  };

  const calculateLTV = () => {
    if (!borrowingData.collateralAmount || !borrowingData.borrowAmount) return 0;
    
    const collateralValue = parseFloat(borrowingData.collateralAmount) * 47000; // Mock BTC price
    const borrowValue = parseFloat(borrowingData.borrowAmount) * 47000;
    
    return (borrowValue / collateralValue) * 100;
  };

  const handleLendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lendingData.asset || !lendingData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedAsset = assets.find(a => a.symbol === lendingData.asset);
    if (selectedAsset && parseFloat(lendingData.amount) > selectedAsset.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Lending position created successfully!");
      setLendingData({ asset: "", amount: "", interestType: "fixed" });
    }, 2000);
  };

  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowingData.collateralAsset || !borrowingData.borrowAsset || 
        !borrowingData.collateralAmount || !borrowingData.borrowAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const ltv = calculateLTV();
    if (ltv > 80) {
      toast.error("LTV ratio too high. Maximum 80%");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Borrowing position created successfully!");
      setBorrowingData({
        collateralAsset: "",
        borrowAsset: "",
        collateralAmount: "",
        borrowAmount: "",
      });
    }, 2000);
  };

  const selectedLendingAsset = assets.find(a => a.symbol === lendingData.asset);
  const currentRate = selectedLendingAsset ? lendingRates[selectedLendingAsset.symbol as keyof typeof lendingRates] : null;
  const ltv = calculateLTV();

  // Show connect wallet prompt if not connected
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
              <CardTitle className="font-sans">Connect Wallet Required</CardTitle>
              <CardDescription className="font-sans">
                Please connect your wallet to access lending and borrowing functionality.
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
                  You need to connect your wallet first to lend or borrow assets.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  // Show authentication prompt if connected but not authenticated
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
              <CardTitle className="font-sans">Authentication Required</CardTitle>
              <CardDescription className="font-sans">
                Please sign in with your wallet to access lending and borrowing functionality.
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
                  You'll be asked to sign a message with your wallet to authenticate.
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
      subtitle="Earn yield by lending or access liquidity by borrowing"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-4xl mx-auto">

        {/* Available Assets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans">Available Assets</CardTitle>
            <CardDescription className="font-sans">
              Your asset balances and current lending rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div key={asset.symbol} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold font-sans">{asset.name}</span>
                    <Badge variant="secondary" className="font-sans">
                      {asset.apy}% APY
                    </Badge>
                  </div>
                  <div className="text-lg font-bold font-mono text-foreground">
                    {asset.balance} {asset.symbol}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">Available</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Lending & Borrowing</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lend" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lend" className="font-sans">Lend</TabsTrigger>
                <TabsTrigger value="borrow" className="font-sans">Borrow</TabsTrigger>
              </TabsList>

              <TabsContent value="lend" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">Lend Assets</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Deposit your assets and earn interest
                  </p>
                </div>

                <form onSubmit={handleLendSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset" className="font-sans font-medium">Asset</Label>
                    <Select 
                      value={lendingData.asset} 
                      onValueChange={(value) => setLendingData({...lendingData, asset: value})}
                    >
                      <SelectTrigger className="font-sans">
                        <SelectValue placeholder="Select asset to lend" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.symbol} value={asset.symbol} className="font-sans">
                            {asset.name} ({asset.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-sans font-medium">Amount</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={lendingData.amount}
                        onChange={(e) => setLendingData({...lendingData, amount: e.target.value})}
                        className="font-mono"
                        step="0.01"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() => selectedLendingAsset && setLendingData({...lendingData, amount: selectedLendingAsset.balance.toString()})}
                      >
                        Max
                      </Button>
                    </div>
                    {selectedLendingAsset && (
                      <div className="text-sm text-muted-foreground font-sans">
                        Available: {selectedLendingAsset.balance} {selectedLendingAsset.symbol}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-medium">Interest Type</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="fixed"
                          name="interestType"
                          value="fixed"
                          checked={lendingData.interestType === "fixed"}
                          onChange={(e) => setLendingData({...lendingData, interestType: e.target.value as "fixed"})}
                          className="text-primary"
                        />
                        <Label htmlFor="fixed" className="font-sans">Fixed Rate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="variable"
                          name="interestType"
                          value="variable"
                          checked={lendingData.interestType === "variable"}
                          onChange={(e) => setLendingData({...lendingData, interestType: e.target.value as "variable"})}
                          className="text-primary"
                        />
                        <Label htmlFor="variable" className="font-sans">Variable Rate</Label>
                      </div>
                    </div>
                  </div>

                  {currentRate && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-medium font-sans">Interest Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 font-mono">
                        {currentRate[lendingData.interestType]}% APY
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        {lendingData.interestType === "fixed" ? "Fixed rate" : "Variable rate"}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 font-sans font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Position..." : "Start Lending"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="borrow" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">Borrow Assets</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Use your assets as collateral to borrow
                  </p>
                </div>

                <form onSubmit={handleBorrowSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Collateral Asset</Label>
                      <Select 
                        value={borrowingData.collateralAsset} 
                        onValueChange={(value) => setBorrowingData({...borrowingData, collateralAsset: value})}
                      >
                        <SelectTrigger className="font-sans">
                          <SelectValue placeholder="Select collateral" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol} className="font-sans">
                              {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Borrow Asset</Label>
                      <Select 
                        value={borrowingData.borrowAsset} 
                        onValueChange={(value) => setBorrowingData({...borrowingData, borrowAsset: value})}
                      >
                        <SelectTrigger className="font-sans">
                          <SelectValue placeholder="Select asset to borrow" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol} className="font-sans">
                              {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Collateral Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={borrowingData.collateralAmount}
                        onChange={(e) => setBorrowingData({...borrowingData, collateralAmount: e.target.value})}
                        className="font-mono"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Borrow Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={borrowingData.borrowAmount}
                        onChange={(e) => setBorrowingData({...borrowingData, borrowAmount: e.target.value})}
                        className="font-mono"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* LTV Indicator */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-primary" />
                        <span className="font-medium font-sans">Loan-to-Value Ratio</span>
                      </div>
                      <span className={`font-mono font-bold ${ltv > 80 ? 'text-red-600' : ltv > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {ltv.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={ltv} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground font-sans">
                      <span>Safe: &lt;60%</span>
                      <span>Risky: 60-80%</span>
                      <span>Max: 80%</span>
                    </div>
                  </div>

                  {borrowingData.borrowAsset && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium font-sans">Borrowing Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 font-mono">
                        {borrowingRates[borrowingData.borrowAsset as keyof typeof borrowingRates]}% APR
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Interest rate for borrowing {borrowingData.borrowAsset}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 font-sans font-semibold"
                    disabled={isLoading || ltv > 80}
                  >
                    {isLoading ? "Creating Position..." : "Start Borrowing"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}