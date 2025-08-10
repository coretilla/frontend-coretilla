import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatToken } from "@/hooks/useFormatToken";
import { DepositTabProps } from "./types";

export function DepositTab({
  collateralAmount,
  onCollateralAmountChange,
  mBTCBalance,
  isPending,
  isConfirming,
  needsMBTCApproval,
  onSubmit,
}: DepositTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold font-sans mb-2">
          Deposit Bitcoin Collateral
        </h3>
        <p className="text-muted-foreground font-sans text-sm">
          Deposit Bitcoin to use as collateral for borrowing
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="collateral-amount" className="font-sans font-medium">
            Bitcoin Amount
          </Label>
          <div className="relative">
            <Input
              id="collateral-amount"
              type="number"
              placeholder="0.00000000"
              value={collateralAmount}
              onChange={(e) => onCollateralAmountChange(e.target.value)}
              className="font-mono"
              step="0.00000001"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
              onClick={() => onCollateralAmountChange(mBTCBalance)}
            >
              Max
            </Button>
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            Available: {formatToken(parseFloat(mBTCBalance))} Bitcoin
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 font-sans font-semibold"
          disabled={isPending || isConfirming || !collateralAmount}
        >
          {isPending || isConfirming
            ? needsMBTCApproval(collateralAmount)
              ? "Approving..."
              : "Depositing..."
            : needsMBTCApproval(collateralAmount)
            ? "Approve Bitcoin"
            : "Deposit Collateral"}
        </Button>
      </form>
    </div>
  );
}
