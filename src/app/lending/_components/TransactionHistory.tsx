import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionHistoryProps } from "./types";

export function TransactionHistory({
  isLoading,
  depositHistory,
  loanHistory,
}: TransactionHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold font-sans mb-2">
          Transaction History
        </h3>
        <p className="text-muted-foreground font-sans text-sm">
          View your lending and borrowing transaction history
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-sans">Loading transaction history...</span>
            </div>
          </div>
        ) : depositHistory.length > 0 || loanHistory.length > 0 ? (
          <div className="space-y-3">
            {depositHistory.map((deposit, index) => (
              <Card key={`deposit-${index}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-semibold font-mono text-lg">
                        {parseFloat(deposit.btcAmount || deposit.amount)}{" "}
                        Bitcoin
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Block: {deposit.blockNumber}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {deposit.transactionHash.slice(0, 10)}...
                        {deposit.transactionHash.slice(-8)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-sans text-blue-600">
                        Deposit Collateral
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          window.open(
                            `https://scan.coredao.org/tx/${deposit.transactionHash}`,
                            "_blank"
                          );
                        }}
                      >
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {loanHistory.map((loan, index) => (
              <Card key={`loan-${index}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-semibold font-mono text-lg">
                        {parseFloat(loan.amount).toFixed(2)} USDT
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Block: {loan.blockNumber}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {loan.transactionHash.slice(0, 10)}...
                        {loan.transactionHash.slice(-8)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-sans text-yellow-600">
                        Loan USDT
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          window.open(
                            `https://scan.coredao.org/tx/${loan.transactionHash}`,
                            "_blank"
                          );
                        }}
                      >
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-muted-foreground font-sans">
              No transaction history found
            </div>
            <p className="text-sm text-muted-foreground font-sans mt-2">
              Your lending and borrowing transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
