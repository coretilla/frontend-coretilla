import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  History,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TransactionItem } from "./TransactionItem";
import { TransactionHistoryProps } from "./types";

export function TransactionHistory({
  transactions,
  isLoading,
  onRefresh,
  pagination,
  onPageChange,
}: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-sans flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="font-sans"
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        {pagination.total > 0 && (
          <CardDescription className="font-sans">
            Showing {transactions.length} of {pagination.total} transactions
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-muted rounded"></div>
                    <div className="w-24 h-3 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <CreditCard className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold font-sans mb-2">
              No transactions yet
            </h3>
            <p className="text-muted-foreground font-sans">
              Your transaction history will appear here once you make your first
              deposit or withdrawal.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                index={index}
              />
            ))}

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground font-sans">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || isLoading}
                    className="font-sans"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={
                      pagination.page >= pagination.totalPages || isLoading
                    }
                    className="font-sans"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
