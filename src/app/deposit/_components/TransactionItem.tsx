import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { TransactionItemProps } from "./types";

export function TransactionItem({ transaction, index }: TransactionItemProps) {
  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatAmount = (amt: number, type: string) => {
    const f = Math.abs(amt).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return type === "DEPOSIT" ? `+$${f}` : `-$${f}`;
  };

  const formatTransactionDescription = (d: string) =>
    d.includes(" - pi_") ? d.split(" - pi_")[0] : d;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.type === "DEPOSIT"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {transaction.type === "DEPOSIT" ? (
            <ArrowDownLeft className="h-5 w-5" />
          ) : (
            <ArrowUpRight className="h-5 w-5" />
          )}
        </div>
        <div>
          <div className="font-medium font-sans">
            {formatTransactionDescription(transaction.description)}
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            {formatDate(transaction.createdAt)} • ID: {transaction.id}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`font-bold font-mono ${
            transaction.type === "DEPOSIT" ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatAmount(transaction.amount, transaction.type)}
        </div>
        <Badge
          variant={transaction.type === "DEPOSIT" ? "default" : "secondary"}
          className="font-sans text-xs"
        >
          {transaction.type}
        </Badge>
      </div>
    </motion.div>
  );
}
