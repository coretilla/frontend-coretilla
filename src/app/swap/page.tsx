"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRightLeft, Info, Clock, Network, CheckCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { getUserData, parseUserBalance, getBtcPrice, swapUsdToBtc } from "@/lib/api";
import { useWallet } from "@/hooks/useWallet";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { useAuth } from "@/hooks/useAuth";

interface SwapFormData {
  fromCurrency: string;
  amount: string;
}

export default function SwapPage() {
  const { isConnected } = useWallet();
  const { isAuthenticated, signIn, isAuthenticating, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<SwapFormData>({
    fromCurrency: "USD",
    amount: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [btcAmount, setBtcAmount] = useState("0.00000000");

  const [btcPrice, setBtcPrice] = useState(47234.56);
  const [userBalance, setUserBalance] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", rate: btcPrice },
  ];

  // Fetch user info and BTC price from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserData();
        if (data) {
          setUserInfo(data);
          const balances = parseUserBalance(data);
          setUserBalance(balances.USD || 0);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchBtcPrice = async () => {
      try {
        const data = await getBtcPrice();
        if (data.success) {
          setBtcPrice(parseFloat(data.data.price.toString()));
        }
      } catch (error) {
        console.error('Error fetching BTC price:', error);
      }
    };

    fetchUserInfo();
    fetchBtcPrice();
    // Refresh price every 30 seconds
    const interval = setInterval(fetchBtcPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const coreBalance = userInfo?.coreBalance || 0;
  const coreBalanceInUsd = userInfo?.coreBalanceInUsd || 0;
  const wbtcBalance = userInfo?.wbtcBalance || 0;
  const wbtcBalanceInUsd = userInfo?.wbtcBalanceInUsd || 0;

  const currentBalances = {
    USD: userBalance,
    CORE: coreBalance,
    CORE_USD: coreBalanceInUsd,
    WBTC: wbtcBalance,
    WBTC_USD: wbtcBalanceInUsd,
  };

  const networkFee = 0.0001; // BTC
  const estimatedTime = "2-5 minutes";

  // Calculate BTC amount based on USD input
  useEffect(() => {
    if (formData.amount) {
      const fiatAmount = parseFloat(formData.amount);
      const btcReceived = fiatAmount / btcPrice;
      setBtcAmount(btcReceived.toFixed(8));
    } else {
      setBtcAmount("0.00000000");
    }
  }, [formData.amount, btcPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error("Please enter an amount");
      return;
    }

    if (parseFloat(formData.amount) > userBalance) {
      toast.error("Insufficient balance");
      return;
    }

    // Show confirmation dialog directly
    setShowConfirmation(true);
  };

  const handleConfirmSwap = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    
    try {
      const data = await swapUsdToBtc({
        amount: parseFloat(formData.amount)
      });
      
      if (data.success) {
        setUserBalance(data.data.remainingBalance);
        toast.success("Swap completed successfully! Bitcoin has been added to your wallet.");
        
        // Reset form
        setFormData({
          fromCurrency: "USD",
          amount: "",
        });
      } else {
        throw new Error('Swap failed');
      }
    } catch (error) {
      toast.error('Failed to process swap. Please try again.');
      console.error('Swap error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCurrency = currencies[0];

  // Show connect wallet prompt if not connected
  if (!isConnected) {
    return (
      <PageWrapper 
        title="Swap USD to Bitcoin"
        subtitle="Connect your wallet to start swapping currencies."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Connect Wallet Required</CardTitle>
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

  // Show authentication prompt if connected but not authenticated
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
              <CardTitle className="font-sans">Authentication Required</CardTitle>
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
      title="Swap USD to Bitcoin"
      subtitle="Convert your fiat currency to Bitcoin on Core Network"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-2xl mx-auto">

        {/* Current Balances */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-sans">Available Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary font-mono">
                  ${currentBalances.USD.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground font-sans">US Dollar</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary font-mono">
                  {currentBalances.CORE.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground font-sans">CORE</div>
                <div className="text-xs text-muted-foreground font-sans mt-1">
                  ${currentBalances.CORE_USD.toLocaleString()}
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary font-mono">
                  {currentBalances.WBTC.toFixed(6)}
                </div>
                <div className="text-sm text-muted-foreground font-sans flex items-center justify-center">
                  <Image src="/image/btcLogo.png" alt="Bitcoin" width={40} height={12} className="object-contain" />
                  <span className="mr-5">wBTC</span>
                </div>
                <div className="text-xs text-muted-foreground font-sans mt-1">
                  ${currentBalances.WBTC_USD.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swap Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Swap Details</CardTitle>
            <CardDescription className="font-sans">
              Exchange your fiat currency for Bitcoin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* From Currency */}
              <div className="space-y-2">
                <Label htmlFor="fromCurrency" className="font-sans font-medium">From</Label>
                <Select 
                  value={formData.fromCurrency} 
                  onValueChange={(value) => setFormData({...formData, fromCurrency: value})}
                >
                  <SelectTrigger className="font-sans">
                    <SelectValue placeholder="Select currency to swap from" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code} className="font-sans">
                        {currency.symbol} {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="font-sans font-medium">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                    {selectedCurrency?.symbol || "$"}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="pl-8 font-mono"
                    min="0"
                    step="0.01"
                  />
                </div>
                {selectedCurrency && (
                  <div className="text-sm text-muted-foreground font-sans">
                    Available: {selectedCurrency.symbol}{currentBalances[selectedCurrency.code as keyof typeof currentBalances].toLocaleString()}
                  </div>
                )}
              </div>

              {/* Swap Arrow */}
              <div className="flex justify-center">
                <div className="p-2 bg-muted rounded-full">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* To Bitcoin */}
              <div className="space-y-2">
                <Label className="font-sans font-medium">To</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
                    <Image src="/image/btcLogo.png" alt="Bitcoin" width={20} height={20} className="object-contain" />
                  </span>
                  <Input
                    value={btcAmount}
                    readOnly
                    className="pl-10 font-mono bg-muted"
                    placeholder="0.00000000"
                  />
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Bitcoin (BTC) on Core Network
                </div>
              </div>

              {/* Exchange Rate */}
              {selectedCurrency && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium font-sans">Exchange Rate</span>
                    <span className="text-sm font-mono">
                      1 BTC = {selectedCurrency.symbol}{selectedCurrency.rate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span className="font-sans">Network Fee</span>
                    <span className="font-mono">{networkFee} BTC</span>
                  </div>
                </div>
              )}

              {/* Network Info */}
              <Alert>
                <Network className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Powered by Core Network. BTC will be sent to your Core wallet.</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span>Estimated confirmation time: {estimatedTime}</span>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
                disabled={isLoading || !formData.amount || !formData.fromCurrency}
              >
                {isLoading ? "Processing..." : "Swap Now"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">Confirm Swap</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3 font-sans">Transaction Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">From:</span>
                    <span className="font-mono font-semibold">
                      {selectedCurrency?.symbol}{formData.amount} {formData.fromCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">To:</span>
                    <span className="font-mono font-semibold">
                      {btcAmount} BTC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Network:</span>
                    <span className="font-sans">Core Network</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Network Fee:</span>
                    <span className="font-mono">{networkFee} BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Estimated Time:</span>
                    <span className="font-sans">{estimatedTime}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="font-sans">You'll Receive:</span>
                    <span className="font-mono text-primary">
                      {(parseFloat(btcAmount) - networkFee).toFixed(8)} BTC
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 font-sans font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSwap}
                  className="flex-1 bg-primary hover:bg-primary/90 font-sans font-semibold"
                >
                  Confirm Swap
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}