"use client";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function UnstakeCard({
  canUnstake,
  cooldownEnd,
  stakedAmount,
  onOpen,
}: {
  canUnstake: boolean;
  cooldownPeriod: number;
  cooldownEnd: number;
  stakedAmount: string;
  onOpen: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold font-sans mb-2">
          Unstake Bitcoin
        </h3>
        <p className="text-muted-foreground font-sans text-sm">
          Unstake your Bitcoin
        </p>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-medium font-sans">Unstaking Status</span>
        </div>
        <div className="text-sm text-muted-foreground font-sans">
          {canUnstake ? (
            <span className="text-green-600">✓ Ready to unstake</span>
          ) : (
            <span className="text-orange-600">⏳ Cooldown required</span>
          )}
        </div>
        {cooldownEnd > 0 && (
          <div className="text-sm text-muted-foreground font-sans">
            Cooldown ends: {new Date(cooldownEnd * 1000).toLocaleString()}
          </div>
        )}
      </div>
      <Button
        onClick={onOpen}
        className="w-full bg-orange-600 hover:bg-orange-700 font-sans font-semibold cursor-pointer"
        disabled={parseFloat(stakedAmount) === 0}
      >
        {canUnstake ? "Unstake Bitcoin" : "Start Cooldown"}
      </Button>
    </div>
  );
}
