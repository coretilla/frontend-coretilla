import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorrowTabProps } from "./types";

export function BorrowTab({
  borrowAmount,
  onBorrowAmountChange,
  maxBorrowAmount,
  collateralBalance,
  isPending,
  isConfirming,
  onSubmit,
}: BorrowTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold font-sans mb-2">Borrow USDT</h3>
        <p className="text-muted-foreground font-sans text-sm">
          Borrow USDT against your collateral
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="borrow-amount" className="font-sans font-medium">
            USDT Amount
          </Label>
          <div className="relative">
            <Input
              id="borrow-amount"
              type="number"
              placeholder="0.00"
              value={borrowAmount}
              onChange={(e) => onBorrowAmountChange(e.target.value)}
              className="font-mono"
              step="0.01"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
              onClick={() => onBorrowAmountChange(maxBorrowAmount)}
            >
              Max
            </Button>
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            Max borrowable: {parseFloat(maxBorrowAmount).toFixed(2)} USDT
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 font-sans font-semibold"
          disabled={
            isPending ||
            isConfirming ||
            !borrowAmount ||
            parseFloat(collateralBalance) === 0
          }
        >
          {isPending || isConfirming ? "Borrowing..." : "Borrow USDT"}
        </Button>
      </form>
    </div>
  );
}
