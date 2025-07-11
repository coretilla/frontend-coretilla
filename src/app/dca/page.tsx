"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, TrendingUp, Clock, DollarSign, Repeat } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";

interface DCAData {
  fiatSource: string;
  amount: string;
  frequency: string;
  duration: string;
}

export default function DCAPage() {
  const [dcaData, setDcaData] = useState<DCAData>({
    fiatSource: "",
    amount: "",
    frequency: "",
    duration: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", balance: 1250.00 },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", balance: 18750000 },
    { code: "EUR", name: "Euro", symbol: "€", balance: 1100.50 },
  ];

  const frequencies = [
    { value: "daily", name: "Daily", description: "Every day" },
    { value: "weekly", name: "Weekly", description: "Every week" },
    { value: "monthly", name: "Monthly", description: "Every month" },
  ];

  const durations = [
    { value: "3", name: "3 Months" },
    { value: "6", name: "6 Months" },
    { value: "12", name: "12 Months" },
    { value: "24", name: "24 Months" },
  ];

  const calculateProjection = () => {
    if (!dcaData.amount || !dcaData.frequency || !dcaData.duration) return null;

    const amount = parseFloat(dcaData.amount);
    const duration = parseInt(dcaData.duration);
    const btcPrice = 47000; // Mock BTC price
    
    const frequencyMultiplier = {
      daily: 30.44, // Average days per month
      weekly: 4.33, // Average weeks per month
      monthly: 1
    };

    const multiplier = frequencyMultiplier[dcaData.frequency as keyof typeof frequencyMultiplier];
    const totalInvested = amount * multiplier * duration;
    const totalBTC = totalInvested / btcPrice;
    const averageCost = totalInvested / totalBTC;

    return {
      totalInvested,
      totalBTC,
      averageCost,
      frequency: dcaData.frequency,
      duration: duration,
      intervalAmount: amount
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dcaData.fiatSource || !dcaData.amount || !dcaData.frequency || !dcaData.duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedCurrency = currencies.find(c => c.code === dcaData.fiatSource);
    if (!selectedCurrency) return;

    const amount = parseFloat(dcaData.amount);
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Check if user has enough balance for at least one purchase
    if (amount > selectedCurrency.balance) {
      toast.error("Insufficient balance for initial purchase");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("DCA plan created successfully!");
      setDcaData({
        fiatSource: "",
        amount: "",
        frequency: "",
        duration: "",
      });
    }, 2000);
  };

  const selectedCurrency = currencies.find(c => c.code === dcaData.fiatSource);
  const projection = calculateProjection();

  return (
    <PageWrapper 
      title="DCA Bitcoin Investment"
      subtitle="Set up recurring Bitcoin purchases to dollar-cost average your investment"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-4xl mx-auto">

        {/* What is DCA */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              What is Dollar-Cost Averaging?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">Regular Purchases</div>
                <div className="text-sm text-muted-foreground font-sans">
                  Buy Bitcoin at fixed intervals regardless of price
                </div>
              </div>
              <div className="text-center p-4">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">Reduce Risk</div>
                <div className="text-sm text-muted-foreground font-sans">
                  Smooth out price volatility over time
                </div>
              </div>
              <div className="text-center p-4">
                <Repeat className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold font-sans mb-1">Automated</div>
                <div className="text-sm text-muted-foreground font-sans">
                  Set it and forget it - no timing needed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Balances */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans">Available Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currencies.map((currency) => (
                <div key={currency.code} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary font-mono">
                    {currency.symbol}{currency.balance.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">{currency.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DCA Setup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Create DCA Plan</CardTitle>
              <CardDescription className="font-sans">
                Set up your recurring Bitcoin investment plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-sans font-medium">Fiat Source</Label>
                  <Select 
                    value={dcaData.fiatSource} 
                    onValueChange={(value) => setDcaData({...dcaData, fiatSource: value})}
                  >
                    <SelectTrigger className="font-sans">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code} className="font-sans">
                          {currency.symbol} {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCurrency && (
                    <div className="text-sm text-muted-foreground font-sans">
                      Available: {selectedCurrency.symbol}{selectedCurrency.balance.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">Amount per Purchase</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                      {selectedCurrency?.symbol || "$"}
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={dcaData.amount}
                      onChange={(e) => setDcaData({...dcaData, amount: e.target.value})}
                      className="pl-8 font-mono"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">Frequency</Label>
                  <Select 
                    value={dcaData.frequency} 
                    onValueChange={(value) => setDcaData({...dcaData, frequency: value})}
                  >
                    <SelectTrigger className="font-sans">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value} className="font-sans">
                          {freq.name} - {freq.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">Duration</Label>
                  <Select 
                    value={dcaData.duration} 
                    onValueChange={(value) => setDcaData({...dcaData, duration: value})}
                  >
                    <SelectTrigger className="font-sans">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value} className="font-sans">
                          {duration.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Plan..." : "Start DCA Plan"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Projection Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans flex items-center gap-2">
                <Image src="/image/btcLogo.png" alt="Bitcoin" width={20} height={20} className="object-contain" />
                Investment Projection
              </CardTitle>
              <CardDescription className="font-sans">
                Estimated results of your DCA plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projection ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-foreground font-mono">
                        {selectedCurrency?.symbol}{projection.totalInvested.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">Total Invested</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-orange-500 font-mono">
                        {projection.totalBTC.toFixed(8)}
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">Total BTC</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Purchase Amount:</span>
                      <span className="font-mono font-semibold">
                        {selectedCurrency?.symbol}{projection.intervalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Frequency:</span>
                      <Badge variant="secondary" className="font-sans">
                        {projection.frequency.charAt(0).toUpperCase() + projection.frequency.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Duration:</span>
                      <span className="font-sans font-semibold">
                        {projection.duration} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Average Cost:</span>
                      <span className="font-mono font-semibold">
                        ${projection.averageCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Mock Chart */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium font-sans">Projected BTC Holdings</div>
                    <div className="h-32 bg-muted rounded-lg flex items-end justify-center gap-1 p-2">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-primary rounded-t-sm flex-1 transition-all duration-300"
                          style={{ 
                            height: `${((i + 1) / 12) * 100}%`,
                            maxHeight: '100%'
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans text-center">
                      BTC accumulation over {projection.duration} months
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-muted-foreground font-sans">
                    Fill in the form to see your investment projection
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-sans">Benefits of DCA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">Reduces Timing Risk</div>
                    <div className="text-sm text-muted-foreground font-sans">
                      No need to time the market perfectly
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">Emotional Discipline</div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Removes emotional decision-making
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">Flexible Budgeting</div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Invest small amounts regularly
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <div className="font-medium font-sans">Compound Growth</div>
                    <div className="text-sm text-muted-foreground font-sans">
                      Benefit from long-term appreciation
                    </div>
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