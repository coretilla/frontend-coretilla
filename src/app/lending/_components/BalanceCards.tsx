import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Coins } from "lucide-react";
import Image from "next/image";
import { formatToken } from "@/hooks/useFormatToken";
import { BalanceCardsProps } from "./types";

export function BalanceCards({
  mBTCBalance,
  mUSDTBalance,
  collateralBalance,
  borrowedBalance,
}: BalanceCardsProps) {
  return (
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
            <CardTitle className="text-sm font-sans">Bitcoin Balance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            {formatToken(parseFloat(mBTCBalance))}
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
            <CardTitle className="text-sm font-sans">USDT Balance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            {parseFloat(mUSDTBalance).toFixed(2)}
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
            {formatToken(parseFloat(collateralBalance))}
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
            {parseFloat(borrowedBalance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground font-sans">
            USDT borrowed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
