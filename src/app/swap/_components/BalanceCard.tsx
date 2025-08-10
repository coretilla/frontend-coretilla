"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import Image from "next/image";
import type { Balances } from "./useSwap";

export default function BalancesCard({ balances }: { balances: Balances }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-sans">Available Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary font-mono">
              ${balances.USD.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-sans flex items-center justify-center mt-3">
              <DollarSign className="h-3 w-3 text-primary mb-2 mt-1.5" />
              <div className="text-sm text-muted-foreground font-sans">
                US Dollar
              </div>
            </div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary font-mono">
              {balances.CORE.toFixed(1).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-sans flex items-center justify-center gap-1 mt-3">
              <Image
                src="/image/coreDaoLogo.png"
                alt="Core"
                width={20}
                height={12}
                className="object-contain"
              />
              <span className="mr-5">Core</span>
            </div>
            <div className="text-xs text-muted-foreground font-sans mt-1">
              ${balances.CORE_USD.toLocaleString()}
            </div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary font-mono">
              {balances.WBTC.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground font-sans flex items-center justify-center">
              <Image
                src="/image/btcLogo.png"
                alt="Bitcoin"
                width={30}
                height={12}
                className="object-contain"
              />
              <span className="mr-5">Bitcoin</span>
            </div>
            <div className="text-xs text-muted-foreground font-sans mt-1">
              ${balances.WBTC_USD.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
