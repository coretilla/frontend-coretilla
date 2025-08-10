"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatToken } from "@/hooks/useFormatToken";

export default function ProjectionCard({
  projection,
  selectedCurrency,
  formatPrice,
  yearlyGrowthPrediction,
  duration,
}: any) {
  if (!projection) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans flex items-center gap-2">
          <Image
            src="/image/btcLogo.png"
            alt="Bitcoin"
            width={20}
            height={20}
            className="object-contain"
          />
          Investment Projection
          <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-normal">
            🎯 Realistic Simulation
          </div>
        </CardTitle>
        <CardDescription className="font-sans">
          Detailed projection with {yearlyGrowthPrediction}% growth trend +
          market volatility simulation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Metric
              title="Total Invested"
              value={`${
                selectedCurrency?.symbol
              }${projection.totalInvested.toLocaleString()}`}
            />
            <Metric
              title="Total BTC"
              value={formatToken(projection.totalBTC)}
              accent="text-orange-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Metric
              title={projection.profitLoss >= 0 ? "Profit" : "Loss"}
              value={`${selectedCurrency?.symbol}${Math.abs(
                projection.profitLoss
              ).toLocaleString()}`}
              accent={
                projection.profitLoss >= 0 ? "text-green-600" : "text-red-600"
              }
            />
            <Metric
              title="Return"
              value={`${
                projection.profitLossPercentage >= 0 ? "+" : ""
              }${projection.profitLossPercentage.toFixed(1)}%`}
              accent={
                projection.profitLossPercentage >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            />
          </div>
          <Separator />
          <KeyValue
            k="Purchase Amount:"
            v={`${selectedCurrency?.symbol}${projection.intervalAmount}`}
          />
          <KeyValue
            k="Frequency:"
            v={
              <Badge variant="secondary" className="font-sans">
                {projection.frequency.charAt(0).toUpperCase() +
                  projection.frequency.slice(1)}
              </Badge>
            }
          />
          <KeyValue k="Duration:" v={`${projection.duration} months`} />
          <KeyValue k="Average Cost:" v={formatPrice(projection.averageCost)} />

          <Separator />
          <div className="space-y-2">
            <div className="text-sm font-medium font-sans">
              Projected BTC Holdings
            </div>
            <div className="h-32 bg-muted rounded-lg flex items-end justify-center gap-1 p-2">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="bg-primary rounded-t-sm flex-1"
                  style={{
                    height: `${((i + 1) / 12) * 100}%`,
                    maxHeight: "100%",
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-sans text-center">
              BTC accumulation over {duration} months
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  title,
  value,
  accent,
}: {
  title: string;
  value: any;
  accent?: string;
}) {
  return (
    <div className="text-center p-4 bg-muted rounded-lg">
      <div
        className={`text-lg font-bold font-mono ${accent || "text-foreground"}`}
      >
        {value}
      </div>
      <div className="text-sm text-muted-foreground font-sans">{title}</div>
    </div>
  );
}
function KeyValue({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground font-sans">{k}</span>
      <span className="font-mono font-semibold">{v}</span>
    </div>
  );
}
