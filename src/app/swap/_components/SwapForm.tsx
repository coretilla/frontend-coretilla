"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRightLeft, Clock, Info, Network } from "lucide-react";
import Image from "next/image";
import { Props2 } from "./types";

export default function SwapForm({
  currencies,
  selectedCurrency,
  currentBalance,
  formData,
  setFormData,
  btcAmount,
  networkFee,
  estimatedTime,
  isLoading,
  onSubmit,
}: Props2) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Swap Details</CardTitle>
        <CardDescription className="font-sans">
          Exchange your fiat currency for Bitcoin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fromCurrency" className="font-sans font-medium">
              From
            </Label>
            <Select
              value={formData.fromCurrency}
              onValueChange={(v) =>
                setFormData({ ...formData, fromCurrency: v })
              }
            >
              <SelectTrigger className="font-sans">
                <SelectValue placeholder="Select currency to swap from" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="font-sans">
                    {c.symbol} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="font-sans font-medium">
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                {selectedCurrency?.symbol || "$"}
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="pl-8 font-mono"
                min="0"
                step="0.01"
              />
            </div>
            <div className="text-sm text-muted-foreground font-sans">
              Available: {selectedCurrency.symbol}
              {currentBalance.toLocaleString()}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="p-2 bg-muted rounded-full">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-sans font-medium">Bitcoin Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                <Image
                  src="/image/btcLogo.png"
                  alt="Bitcoin"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </span>
              <Input
                value={btcAmount}
                readOnly
                className="pl-10 font-mono bg-muted"
                placeholder="0.00000"
              />
            </div>
            <div className="text-sm text-muted-foreground font-sans">
              Bitcoin (BTC) on Core Network
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium font-sans">
                Exchange Rate
              </span>
              <span className="text-sm font-mono">
                1 BTC = {selectedCurrency.symbol}
                {selectedCurrency.rate.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="font-sans">Network Fee</span>
              <span className="font-mono">{networkFee} BTC</span>
            </div>
          </div>

          <Alert>
            <Network className="h-4 w-4" />
            <AlertDescription className="font-sans">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>
                  Powered by Core Network. BTC will be sent to your Core wallet.
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4" />
                <span>Estimated confirmation time: {estimatedTime}</span>
              </div>
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold cursor-pointer"
            disabled={isLoading || !formData.amount || !formData.fromCurrency}
          >
            {isLoading ? "Processing..." : "Buy Bitcoin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
