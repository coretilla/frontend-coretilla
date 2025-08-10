import React from "react";
import { Badge } from "@/components/ui/badge";

interface ChartData {
  day: string;
  value: number;
}

interface PortfolioChartProps {
  chartData: Record<string, ChartData[]>;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export function PortfolioChart({
  chartData,
  selectedPeriod,
  onPeriodChange,
}: PortfolioChartProps) {
  return (
    <>
      <div className="flex gap-2 mb-4">
        {["7D", "1M", "All"].map((period) => (
          <Badge
            key={period}
            variant={selectedPeriod === period ? "default" : "secondary"}
            className="cursor-pointer font-sans"
            onClick={() => onPeriodChange(period)}
          >
            {period}
          </Badge>
        ))}
      </div>

      <div className="h-48 bg-muted rounded-lg flex items-end justify-center gap-2 p-4">
        {chartData[selectedPeriod as keyof typeof chartData].map(
          (item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="bg-primary rounded-t-sm w-8 transition-all duration-300"
                style={{ height: `${(item.value / 10000) * 100}%` }}
              />
              <div className="text-xs text-muted-foreground font-sans">
                {item.day}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}