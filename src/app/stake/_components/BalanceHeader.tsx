"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap } from "lucide-react";
import Image from "next/image";

export default function BalancesHeader({
  mBTCBalance,
  stakedAmount,
  pendingRewards,
  onClaim,
  disabled,
}: {
  mBTCBalance: string;
  stakedAmount: string;
  pendingRewards: string;
  onClaim: () => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-sans flex items-center">
            <Image
              src="/image/btcLogo.png"
              alt="Bitcoin"
              width={40}
              height={20}
              className="object-contain"
            />
            Bitcoin Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-foreground">
            {parseFloat(mBTCBalance).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            Available
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-sans flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Staked Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-foreground">
            {parseFloat(stakedAmount).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            Bitcoin Staked
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-sans flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            Pending Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-green-600">
            {parseFloat(pendingRewards).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            <button
              onClick={onClaim}
              className="text-green-600 hover:text-green-700 p-0 h-auto disabled:opacity-50"
              disabled={disabled}
            >
              Claim Rewards
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
