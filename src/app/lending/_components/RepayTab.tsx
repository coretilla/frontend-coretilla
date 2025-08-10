import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RepayTabProps } from "./types";

export function RepayTab({
  repayAmount,
  onRepayAmountChange,
  borrowedBalance,
  isPending,
  isConfirming,
  needsMUSDTApproval,
  onSubmit,
}: RepayTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold font-sans mb-2">Repay Loan</h3>
        <p className="text-muted-foreground font-sans text-sm">
          Repay your USDT loan to reduce debt
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repay-amount" className="font-sans font-medium">
            USDT Amount
          </Label>
          <div className="relative">
            <Input
              id="repay-amount"
              type="number"
              placeholder="0.00"
              value={repayAmount}
              onChange={(e) => onRepayAmountChange(e.target.value)}
              className="font-mono"
              step="0.01"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary font-sans"
              onClick={() => onRepayAmountChange(borrowedBalance)}
            >
              Max
            </Button>
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            Borrowed: {parseFloat(borrowedBalance).toFixed(2)} USDT
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 font-sans font-semibold"
          disabled={
            isPending ||
            isConfirming ||
            !repayAmount ||
            parseFloat(borrowedBalance) === 0
          }
        >
          {isPending || isConfirming
            ? needsMUSDTApproval(repayAmount)
              ? "Approving..."
              : "Repaying..."
            : needsMUSDTApproval(repayAmount)
            ? "Approve USDT"
            : "Repay Loan"}
        </Button>
      </form>
    </div>
  );
}
