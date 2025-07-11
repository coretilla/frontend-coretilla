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

interface SwapFormData {
  fromCurrency: string;
  amount: string;
}

export default function SwapPage() {
  const [formData, setFormData] = useState<SwapFormData>({
    fromCurrency: "",
    amount: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [btcAmount, setBtcAmount] = useState("0.00000000");

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", rate: 47234.56 },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 751000000 },
  ];

  const currentBalances = {
    USD: 0.00,
    IDR: 0,
    BTC: 0.00000000,
  };

  const networkFee = 0.0001; // BTC
  const estimatedTime = "2-5 minutes";

  // Calculate BTC amount based on fiat input
  useEffect(() => {
    if (formData.amount && formData.fromCurrency) {
      const selectedCurrency = currencies.find(c => c.code === formData.fromCurrency);
      if (selectedCurrency) {
        const fiatAmount = parseFloat(formData.amount);
        const btcReceived = fiatAmount / selectedCurrency.rate;
        setBtcAmount(btcReceived.toFixed(8));
      }
    } else {
      setBtcAmount("0.00000000");
    }
  }, [formData.amount, formData.fromCurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fromCurrency || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedCurrency = currencies.find(c => c.code === formData.fromCurrency);
    const userBalance = currentBalances[formData.fromCurrency as keyof typeof currentBalances];
    
    if (parseFloat(formData.amount) > userBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const handleConfirmSwap = () => {
    setShowConfirmation(false);
    toast.success("Swap transaction submitted successfully!");
    
    // Reset form
    setFormData({
      fromCurrency: "",
      amount: "",
    });
  };

  const selectedCurrency = currencies.find(c => c.code === formData.fromCurrency);

  return (
    <PageWrapper 
      title="Swap to Bitcoin"
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
              {currencies.map((currency) => (
                <div key={currency.code} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary font-mono">
                    {currency.symbol}{currentBalances[currency.code as keyof typeof currentBalances].toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">{currency.name}</div>
                </div>
              ))}
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary font-mono">
                  {currentBalances.BTC.toFixed(8)}
                </div>
                <div className="text-sm text-muted-foreground font-sans">Bitcoin</div>
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