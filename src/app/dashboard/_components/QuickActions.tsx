import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-sans">Quick Actions</CardTitle>
        <CardDescription className="font-sans">
          Manage your portfolio with these quick actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/deposit"
            className="p-4 border rounded-lg hover:border-primary transition-colors text-center"
          >
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="font-medium font-sans">Deposit</div>
            <div className="text-sm text-muted-foreground font-sans">
              Add funds
            </div>
          </Link>
          <Link
            href="/swap"
            className="p-4 border rounded-lg hover:border-primary transition-colors text-center"
          >
            <Image
              src="/image/btcLogo.png"
              alt="Bitcoin"
              width={32}
              height={32}
              className="object-contain mx-auto mb-2"
            />
            <div className="font-medium font-sans">Swap</div>
            <div className="text-sm text-muted-foreground font-sans">
              Trade assets
            </div>
          </Link>
          <Link
            href="/stake"
            className="p-4 border rounded-lg hover:border-primary transition-colors text-center"
          >
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="font-medium font-sans">Stake</div>
            <div className="text-sm text-muted-foreground font-sans">
              Earn rewards
            </div>
          </Link>
          <Link
            href="/dca"
            className="p-4 border rounded-lg hover:border-primary transition-colors text-center"
          >
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="font-medium font-sans">DCA</div>
            <div className="text-sm text-muted-foreground font-sans">
              DCA Simulation
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}