"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview({
  apy,
  stakedAmount,
  pendingRewards,
  cooldownPeriod,
}: {
  apy: number;
  stakedAmount: string;
  pendingRewards: string;
  cooldownPeriod: number;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="font-sans">Staking Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            label="APY"
            value={`${(apy * 100).toFixed(1)}%`}
            variant="primary"
          />
          <Stat
            label="Your Staked"
            value={parseFloat(stakedAmount).toFixed(1)}
          />
          <Stat
            label="Pending Rewards"
            value={parseFloat(pendingRewards).toFixed(1)}
            variant="green"
          />
          <Stat
            label="Cooldown"
            value={`${Math.floor(cooldownPeriod / 86400)}d`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant?: "primary" | "green";
}) {
  const color =
    variant === "primary"
      ? "text-primary"
      : variant === "green"
      ? "text-green-600"
      : "text-foreground";
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground font-sans">{label}</div>
    </div>
  );
}
