"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bitcoin, TrendingUp, Info, Zap } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface StakeFormData {
  btcAmount: string;
  lstBtcAmount: string;
}

export default function StakePage() {
  const [formData, setFormData] = useState<StakeFormData>({
    btcAmount: "",
    lstBtcAmount: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState("convert");

  // Mock balances
  const balances = {
    BTC: 0.15,
    lstBTC: 0.08,
    istBTC: 0.002,
  };

  const stakingData = {
    apr: 12.5,
    totalStaked: 1.25,
    totalRewards: 0.156,
    stakingPeriod: "Flexible",
    minStake: 0.001,
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.btcAmount || parseFloat(formData.btcAmount) <= 0) {
      toast.error("Please enter a valid BTC amount");
      return;
    }

    if (parseFloat(formData.btcAmount) > balances.BTC) {
      toast.error("Insufficient BTC balance");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lstBtcAmount || parseFloat(formData.lstBtcAmount) <= 0) {
      toast.error("Please enter a valid lstBTC amount");
      return;
    }

    if (parseFloat(formData.lstBtcAmount) > balances.lstBTC) {
      toast.error("Insufficient lstBTC balance");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Successfully staked lstBTC!");
      setFormData({ ...formData, lstBtcAmount: "" });
    }, 2000);
  };

  const handleConfirmConvert = () => {
    setShowConfirmation(false);
    toast.success("Successfully converted BTC to lstBTC!");
    setFormData({ ...formData, btcAmount: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-sans font-medium">Back to Home</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-sans">lstBTC Staking</h1>
            <p className="text-muted-foreground font-sans">
              Convert BTC to lstBTC and stake to earn istBTC rewards
            </p>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-orange-500" />
                BTC Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-foreground">
                {balances.BTC.toFixed(8)}
              </div>
              <div className="text-sm text-muted-foreground font-sans">Available</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                lstBTC Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-foreground">
                {balances.lstBTC.toFixed(8)}
              </div>
              <div className="text-sm text-muted-foreground font-sans">Liquid Staking</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                istBTC Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-green-600">
                {balances.istBTC.toFixed(8)}
              </div>
              <div className="text-sm text-muted-foreground font-sans">Rewards</div>
            </CardContent>
          </Card>
        </div>

        {/* Staking Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans">Staking Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">
                  {stakingData.apr}%
                </div>
                <div className="text-sm text-muted-foreground font-sans">APR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground font-mono">
                  {stakingData.totalStaked}
                </div>
                <div className="text-sm text-muted-foreground font-sans">Total Staked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-mono">
                  {stakingData.totalRewards}
                </div>
                <div className="text-sm text-muted-foreground font-sans">Total Rewards</div>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-sm font-sans">
                  {stakingData.stakingPeriod}
                </Badge>
                <div className="text-sm text-muted-foreground font-sans mt-1">Period</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Staking Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Staking Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="convert" className="font-sans">Convert BTC</TabsTrigger>
                <TabsTrigger value="stake" className="font-sans">Stake lstBTC</TabsTrigger>
              </TabsList>

              <TabsContent value="convert" className="space-y-4">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">Convert BTC to lstBTC</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Convert your BTC to lstBTC tokens for liquid staking
                  </p>
                </div>

                <form onSubmit={handleConvertSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="btcAmount" className="font-sans font-medium">
                      BTC Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="btcAmount"
                        type="number"
                        placeholder="0.00000000"
                        value={formData.btcAmount}
                        onChange={(e) => setFormData({...formData, btcAmount: e.target.value})}
                        className="font-mono"
                        step="0.00000001"
                        max={balances.BTC}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() => setFormData({...formData, btcAmount: balances.BTC.toString()})}
                      >
                        Max
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Available: {balances.BTC.toFixed(8)} BTC
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="font-medium font-sans">Conversion Rate</span>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      1 BTC = 1 lstBTC (1:1 conversion)
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      You'll receive: {formData.btcAmount || "0.00000000"} lstBTC
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Converting..." : "Convert to lstBTC"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="stake" className="space-y-4">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">Stake lstBTC</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Stake your lstBTC tokens to start earning istBTC rewards
                  </p>
                </div>

                <form onSubmit={handleStakeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lstBtcAmount" className="font-sans font-medium">
                      lstBTC Amount
                    </Label>
                    <div className="relative">
                      <Input
                        id="lstBtcAmount"
                        type="number"
                        placeholder="0.00000000"
                        value={formData.lstBtcAmount}
                        onChange={(e) => setFormData({...formData, lstBtcAmount: e.target.value})}
                        className="font-mono"
                        step="0.00000001"
                        max={balances.lstBTC}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
                        onClick={() => setFormData({...formData, lstBtcAmount: balances.lstBTC.toString()})}
                      >
                        Max
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Available: {balances.lstBTC.toFixed(8)} lstBTC
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium font-sans">Staking Rewards</span>
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      APR: {stakingData.apr}% (paid in istBTC)
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Minimum stake: {stakingData.minStake} lstBTC
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 font-sans font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Staking..." : "Stake lstBTC"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">Confirm Conversion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3 font-sans">Transaction Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Converting:</span>
                    <span className="font-mono font-semibold">
                      {formData.btcAmount} BTC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Receiving:</span>
                    <span className="font-mono font-semibold">
                      {formData.btcAmount} lstBTC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Conversion Rate:</span>
                    <span className="font-mono">1:1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Network Fee:</span>
                    <span className="font-mono">Free</span>
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
                  onClick={handleConfirmConvert}
                  className="flex-1 bg-primary hover:bg-primary/90 font-sans font-semibold"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}