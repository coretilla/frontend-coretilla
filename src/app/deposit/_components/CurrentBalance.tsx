import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CurrentBalanceProps } from "./types";

export function CurrentBalance({
  balance,
  isLoading,
  onRefresh,
}: CurrentBalanceProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-sans">Current Balance</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="text-center p-6 bg-muted rounded-lg relative">
          {isLoading && (
            <div className="absolute inset-0 bg-muted/50 rounded-lg flex items-center justify-center">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
          <div className="text-3xl font-bold text-primary font-mono">
            ${(balance.USD || 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground font-sans">
            US Dollar
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
