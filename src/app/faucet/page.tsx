"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Coins, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";

interface FaucetStatus {
  mockBTC: {
    canClaim: boolean;
    lastClaimed: number | null;
    dailyLimit: number;
    claimedToday: number;
  };
  mockUSDT: {
    canClaim: boolean;
    lastClaimed: number | null;
    dailyLimit: number;
    claimedToday: number;
  };
}

export default function FaucetPage() {
  const { address, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState({ mockBTC: false, mockUSDT: false });
  const [balances, setBalances] = useState({
    mockBTC: 0.00000000,
    mockUSDT: 0.00,
  });

  // Mock faucet status
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>({
    mockBTC: {
      canClaim: true,
      lastClaimed: null,
      dailyLimit: 0.1,
      claimedToday: 0,
    },
    mockUSDT: {
      canClaim: true,
      lastClaimed: null,
      dailyLimit: 100,
      claimedToday: 0,
    },
  });

  const handleClaimToken = async (tokenType: 'mockBTC' | 'mockUSDT') => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const status = faucetStatus[tokenType];
    if (!status.canClaim) {
      toast.error("Daily limit reached. Try again tomorrow!");
      return;
    }

    setIsLoading(prev => ({ ...prev, [tokenType]: true }));

    try {
      // Simulate faucet claim transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      const claimAmount = tokenType === 'mockBTC' ? 0.01 : 50;
      const newBalance = balances[tokenType] + claimAmount;

      // Update balances
      setBalances(prev => ({
        ...prev,
        [tokenType]: newBalance,
      }));

      // Update faucet status
      setFaucetStatus(prev => ({
        ...prev,
        [tokenType]: {
          ...prev[tokenType],
          canClaim: prev[tokenType].claimedToday + claimAmount >= prev[tokenType].dailyLimit ? false : true,
          lastClaimed: Date.now(),
          claimedToday: prev[tokenType].claimedToday + claimAmount,
        },
      }));

      toast.success(`Successfully claimed ${claimAmount} ${tokenType}!`);
    } catch (error) {
      toast.error("Failed to claim tokens. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [tokenType]: false }));
    }
  };

  const getTimeUntilNextClaim = (lastClaimed: number | null) => {
    if (!lastClaimed) return null;
    
    const nextClaimTime = lastClaimed + (24 * 60 * 60 * 1000); // 24 hours
    const now = Date.now();
    
    if (now >= nextClaimTime) return null;
    
    const hoursLeft = Math.ceil((nextClaimTime - now) / (60 * 60 * 1000));
    return hoursLeft;
  };

  return (
    <PageWrapper 
      title="Token Faucet"
      subtitle="Claim free test tokens to explore the Coretilla platform"
      className="bg-gradient-to-br from-blue-50 to-cyan-100"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* What is a Faucet */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              What is a Token Faucet?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">Free Test Tokens</div>
                <div className="text-sm text-muted-foreground font-sans">
                  Get MockBTC and MockUSDT for testing without real money
                </div>
              </div>
              <div className="text-center p-4">
                <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">No Cost</div>
                <div className="text-sm text-muted-foreground font-sans">
                  Completely free - no gas fees or payments required
                </div>
              </div>
              <div className="text-center p-4">
                <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">Daily Limits</div>
                <div className="text-sm text-muted-foreground font-sans">
                  Claim once per day to prevent abuse
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Connection Alert */}
        {!isConnected && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-sans">
              Please connect your wallet to claim test tokens. Click the "Connect Wallet" button in the top navigation.
            </AlertDescription>
          </Alert>
        )}

        {/* Current Balances */}
        {isConnected && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-sans">Your Test Token Balances</CardTitle>
              <CardDescription className="font-sans">
                Connected as {address?.slice(0, 6)}...{address?.slice(-4)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Image src="/image/btcLogo.png" alt="Bitcoin" width={20} height={20} className="object-contain" />
                    <span className="font-semibold font-sans">MockBTC</span>
                  </div>
                  <div className="text-2xl font-bold text-primary font-mono">
                    {balances.mockBTC.toFixed(8)}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-semibold font-sans">MockUSDT</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 font-mono">
                    {balances.mockUSDT.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Faucet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MockBTC Faucet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-sans flex items-center gap-2">
                  <Image src="/image/btcLogo.png" alt="Bitcoin" width={24} height={24} className="object-contain" />
                  MockBTC Faucet
                </CardTitle>
                <CardDescription className="font-sans">
                  Claim free MockBTC tokens for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-sans">Claim Amount:</span>
                    <span className="font-mono font-semibold">0.01 MockBTC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-sans">Daily Limit:</span>
                    <span className="font-mono">{faucetStatus.mockBTC.dailyLimit} MockBTC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-sans">Claimed Today:</span>
                    <span className="font-mono">{faucetStatus.mockBTC.claimedToday} MockBTC</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {faucetStatus.mockBTC.canClaim ? (
                    <Badge variant="secondary" className="font-sans">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="font-sans">
                      <Clock className="h-3 w-3 mr-1" />
                      Daily Limit Reached
                    </Badge>
                  )}

                  <Button
                    onClick={() => handleClaimToken('mockBTC')}
                    disabled={!isConnected || !faucetStatus.mockBTC.canClaim || isLoading.mockBTC}
                    className="w-full bg-orange-500 hover:bg-orange-600 font-sans font-semibold"
                  >
                    {isLoading.mockBTC ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Claiming...
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 mr-2" />
                        Claim MockBTC
                      </>
                    )}
                  </Button>

                  {!faucetStatus.mockBTC.canClaim && faucetStatus.mockBTC.lastClaimed && (
                    <div className="text-xs text-muted-foreground text-center font-sans">
                      Next claim available in {getTimeUntilNextClaim(faucetStatus.mockBTC.lastClaimed)} hours
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* MockUSDT Faucet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-sans flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  MockUSDT Faucet
                </CardTitle>
                <CardDescription className="font-sans">
                  Claim free MockUSDT tokens for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-sans">Claim Amount:</span>
                    <span className="font-mono font-semibold">50 MockUSDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-sans">Daily Limit:</span>
                    <span className="font-mono">{faucetStatus.mockUSDT.dailyLimit} MockUSDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-sans">Claimed Today:</span>
                    <span className="font-mono">{faucetStatus.mockUSDT.claimedToday} MockUSDT</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {faucetStatus.mockUSDT.canClaim ? (
                    <Badge variant="secondary" className="font-sans">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="font-sans">
                      <Clock className="h-3 w-3 mr-1" />
                      Daily Limit Reached
                    </Badge>
                  )}

                  <Button
                    onClick={() => handleClaimToken('mockUSDT')}
                    disabled={!isConnected || !faucetStatus.mockUSDT.canClaim || isLoading.mockUSDT}
                    className="w-full bg-green-600 hover:bg-green-700 font-sans font-semibold"
                  >
                    {isLoading.mockUSDT ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Claiming...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Claim MockUSDT
                      </>
                    )}
                  </Button>

                  {!faucetStatus.mockUSDT.canClaim && faucetStatus.mockUSDT.lastClaimed && (
                    <div className="text-xs text-muted-foreground text-center font-sans">
                      Next claim available in {getTimeUntilNextClaim(faucetStatus.mockUSDT.lastClaimed)} hours
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans">How to Use the Faucet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-medium font-sans">Connect Your Wallet</div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Click "Connect Wallet" in the navigation to connect your Core wallet
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-medium font-sans">Choose Your Token</div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Select either MockBTC or MockUSDT depending on what you want to test
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-medium font-sans">Claim Tokens</div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Click the claim button and wait for the transaction to complete
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <div className="font-medium font-sans">Start Testing</div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Use your test tokens to explore trading, lending, and other features
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}