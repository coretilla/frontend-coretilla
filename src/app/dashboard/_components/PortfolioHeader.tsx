import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw, TrendingUp } from "lucide-react";
import { PortfolioChart } from "./PortfolioChart";

interface PortfolioHeaderProps {
  totalPortfolioValue: number;
  totalChange: {
    value: number;
    percentage: number;
  };
  isLoading: boolean;
  onRefresh: () => void;
  chartData: Record<string, { day: string; value: number }[]>;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export function PortfolioHeader({
  totalPortfolioValue,
  totalChange,
  isLoading,
  onRefresh,
  chartData,
  selectedPeriod,
  onPeriodChange,
}: PortfolioHeaderProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-sans flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Total Portfolio Value
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
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-4xl font-bold font-mono text-foreground">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                  Loading...
                </div>
              ) : (
                `$${totalPortfolioValue.toLocaleString()}`
              )}
            </div>
            <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="font-mono">${totalChange.value.toFixed(2)}</span>
              <span>({totalChange.percentage}%)</span>
              <span className="text-muted-foreground">7D</span>
            </div>
          </div>
        </div>
        <PortfolioChart
          chartData={chartData}
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
        />
      </CardContent>
    </Card>
  );
}
