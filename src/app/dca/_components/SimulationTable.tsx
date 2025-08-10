"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SimulationTable({
  results,
  formatPrice,
  symbol,
  yearlyGrowthPrediction,
  currentBtcPrice,
}: any) {
  if (!results?.length) return null;
  const last = results[results.length - 1];
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-sans">Month-by-Month Simulation</CardTitle>
        <CardDescription className="font-sans">
          Detailed breakdown with {yearlyGrowthPrediction}% annual BTC growth
          prediction + market volatility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {[
                  "Month",
                  "BTC Price",
                  "Invested",
                  "BTC Bought",
                  "Total BTC",
                  "Portfolio Value",
                ].map((h) => (
                  <th
                    key={h}
                    className={`p-2 ${
                      h === "Month" ? "text-left font-sans" : "text-right"
                    } font-sans font-medium`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r: any) => (
                <tr
                  key={r.month}
                  className="border-b border-muted hover:bg-muted/50"
                >
                  <td className="p-2 font-sans font-medium">{r.month}</td>
                  <td className="text-right p-2 font-mono font-semibold">
                    {formatPrice(r.btcPrice)}
                  </td>
                  <td className="text-right p-2 font-mono">
                    {symbol}
                    {r.amountInvested.toLocaleString()}
                  </td>
                  <td className="text-right p-2 font-mono text-orange-500 font-medium">
                    {r.btcPurchased.toFixed(8)}
                  </td>
                  <td className="text-right p-2 font-mono font-semibold text-blue-600">
                    {r.totalBtc.toFixed(8)}
                  </td>
                  <td className="text-right p-2 font-mono font-bold text-green-600">
                    {symbol}
                    {r.currentValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat
            title="Average Cost per BTC"
            value={formatPrice(last.totalInvested / last.totalBtc)}
          />
          <Stat
            title="BTC Price Range"
            value={`${formatPrice(
              Math.min(...results.map((r: any) => r.btcPrice))
            )} - ${formatPrice(
              Math.max(...results.map((r: any) => r.btcPrice))
            )}`}
            accent="text-blue-600"
          />
          <Stat
            title="Total Return"
            value={`${(
              (last.currentValue / last.totalInvested - 1) *
              100
            ).toFixed(1)}%`}
            accent="text-purple-600"
          />
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm">
          <div className="font-semibold text-blue-800 mb-2">
            Growth Analysis
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-blue-700 font-medium">Predicted Growth:</div>
              <div className="text-blue-900 font-mono">
                {yearlyGrowthPrediction}% annually
              </div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">
                Expected Final Price:
              </div>
              <div className="text-blue-900 font-mono">
                {formatPrice(
                  currentBtcPrice *
                    Math.pow(
                      1 + yearlyGrowthPrediction / 100,
                      results.length / 12
                    )
                )}
              </div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">
                Volatility Impact:
              </div>
              <div className="text-blue-900 font-mono">±15% monthly</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-600">
            * Simulation includes realistic market volatility on top of the
            predicted growth trend
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="text-center p-4 bg-muted rounded-lg">
      <div
        className={`text-lg font-bold font-mono ${accent || "text-primary"}`}
      >
        {value}
      </div>
      <div className="text-sm text-muted-foreground font-sans">{title}</div>
    </div>
  );
}
