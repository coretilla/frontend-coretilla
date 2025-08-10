import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatToken } from "@/hooks/useFormatToken";
import { WithdrawTabProps } from "./types";

export function WithdrawTab({
  withdrawAmount,
  onWithdrawAmountChange,
  collateralBalance,
  isPending,
  isConfirming,
  onSubmit,
}: WithdrawTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold font-sans mb-2">
          Withdraw Collateral
        </h3>
        <p className="text-muted-foreground font-sans text-sm">
          Withdraw your Bitcoin collateral
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="withdraw-amount" className="font-sans font-medium">
            Bitcoin Amount
          </Label>
          <div className="relative">
            <Input
              id="withdraw-amount"
              type="number"
              placeholder="0.00000000"
              value={withdrawAmount}
              onChange={(e) => onWithdrawAmountChange(e.target.value)}
              className="font-mono"
              step="0.00000001"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
              onClick={() => onWithdrawAmountChange(collateralBalance)}
            >
              Max
            </Button>
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            Deposited: {formatToken(parseFloat(collateralBalance))} Bitcoin
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 font-sans font-semibold"
          disabled={
            isPending ||
            isConfirming ||
            !withdrawAmount ||
            parseFloat(collateralBalance) === 0
          }
        >
          {isPending || isConfirming ? "Withdrawing..." : "Withdraw Collateral"}
        </Button>
      </form>
    </div>
  );
}
