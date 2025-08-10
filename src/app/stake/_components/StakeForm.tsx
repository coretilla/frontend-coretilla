"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";

export default function StakeForm({
  mBTCBalance,
  apy,
  yearlyRewards,
  formData,
  setFormData,
  onSubmit,
  isPending,
  isConfirming,
  needsApproval,
  pendingStakeAmount,
}: {
  mBTCBalance: string;
  apy: number;
  yearlyRewards?: string;
  formData: { mBtcAmount: string };
  setFormData: (d: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  isConfirming: boolean;
  needsApproval: (v: string) => boolean;
  pendingStakeAmount: string | null;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold font-sans mb-2">Stake Bitcoin</h3>
        <p className="text-muted-foreground font-sans text-sm">
          Stake your Bitcoin to earn rewards
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mBtcAmount" className="font-sans font-medium">
            Bitcoin Amount
          </Label>
          <div className="relative">
            <Input
              id="mBtcAmount"
              type="number"
              placeholder="0.00000000"
              value={formData.mBtcAmount}
              onChange={(e) =>
                setFormData({ ...formData, mBtcAmount: e.target.value })
              }
              className="font-mono"
              step="0.00000001"
              max={mBTCBalance}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-sans"
              onClick={() =>
                setFormData({ ...formData, mBtcAmount: mBTCBalance })
              }
            >
              Max
            </Button>
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            Available: {parseFloat(mBTCBalance).toFixed(1)} Bitcoin
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-medium font-sans">
              Estimated Yearly Rewards
            </span>
          </div>
          <div className="text-lg font-bold text-green-600 font-mono">
            {parseFloat(yearlyRewards || "0").toFixed(1)} Bitcoin
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            APY: {(apy * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground font-sans mt-1">
            * Calculated from smart contract
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 font-sans font-semibold cursor-pointer"
          disabled={isPending || isConfirming}
        >
          {isPending
            ? pendingStakeAmount
              ? "Approving..."
              : "Processing..."
            : isConfirming
            ? pendingStakeAmount
              ? "Confirming Approval..."
              : "Confirming..."
            : needsApproval(formData.mBtcAmount)
            ? "Approve & Stake"
            : "Stake Bitcoin"}
        </Button>
      </form>
    </div>
  );
}
