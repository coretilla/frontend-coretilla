import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HealthMetricsProps } from "./types";

const formatHealthFactor = (value: number): string => {
  if (!value || isNaN(value)) return "0.00";
  if (value > 999999) return "999+";
  return value.toFixed(2);
};

export function HealthMetrics({
  healthFactor,
  ltvRatio,
  maxLoanToValueRatio,
}: HealthMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Health Factor</CardTitle>
          <CardDescription className="font-sans">
            Higher is safer. Below 1.0 risks liquidation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold font-mono ${
              healthFactor < 1
                ? "text-red-600"
                : healthFactor < 1.5
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {formatHealthFactor(healthFactor)}
          </div>
          <Progress value={Math.min(healthFactor * 50, 100)} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Loan-to-Value Ratio</CardTitle>
          <CardDescription className="font-sans">
            Current: {ltvRatio.toFixed(1)}% | Max: {maxLoanToValueRatio}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold font-mono ${
              ltvRatio > 80
                ? "text-red-600"
                : ltvRatio > 60
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {ltvRatio.toFixed(1)}%
          </div>
          <Progress value={ltvRatio} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
