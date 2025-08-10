"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StrategyForm({
  dcaData,
  setDcaData,
  currencies,
  selectedCurrency,
  frequencies,
  durations,
  yearlyGrowthPrediction,
  setYearlyGrowthPrediction,
  customGrowth,
  setCustomGrowth,
  isCustomGrowth,
  setIsCustomGrowth,
  customDuration,
  setCustomDuration,
  isCustomDuration,
  setIsCustomDuration,
  formatPrice,
  currentBtcPrice,
  onSubmit,
  isLoading,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">
          DCA Strategy & Growth Prediction
        </CardTitle>
        <CardDescription className="font-sans">
          Configure your DCA parameters and BTC growth expectations for instant
          return preview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Fiat */}
          <div className="space-y-2">
            <Label className="font-sans font-medium">Fiat Source</Label>
            <Select
              value={dcaData.fiatSource}
              onValueChange={(v) => setDcaData({ ...dcaData, fiatSource: v })}
            >
              <SelectTrigger className="font-sans">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c: any) => (
                  <SelectItem key={c.code} value={c.code} className="font-sans">
                    {c.symbol} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCurrency && (
              <div className="text-sm text-muted-foreground font-sans">
                Available: {selectedCurrency.symbol}
                {selectedCurrency.balance.toLocaleString()}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="font-sans font-medium">Amount per Purchase</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                {selectedCurrency?.symbol || "$"}
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={dcaData.amount}
                onChange={(e) =>
                  setDcaData({ ...dcaData, amount: e.target.value })
                }
                className="pl-8 font-mono"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-sans font-medium">Frequency</Label>
            <Select
              value={dcaData.frequency}
              onValueChange={(v) => setDcaData({ ...dcaData, frequency: v })}
            >
              <SelectTrigger className="font-sans cursor-pointer">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((f: any) => (
                  <SelectItem
                    key={f.value}
                    value={f.value}
                    className="font-sans cursor-pointer"
                  >
                    {f.name} - {f.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DurationPicker
            {...{
              dcaData,
              setDcaData,
              durations,
              customDuration,
              setCustomDuration,
              isCustomDuration,
              setIsCustomDuration,
            }}
          />

          <GrowthPicker
            {...{
              yearlyGrowthPrediction,
              setYearlyGrowthPrediction,
              customGrowth,
              setCustomGrowth,
              isCustomGrowth,
              setIsCustomGrowth,
            }}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Running Simulation..." : "Run DCA Simulation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DurationPicker({
  dcaData,
  setDcaData,
  durations,
  customDuration,
  setCustomDuration,
  isCustomDuration,
  setIsCustomDuration,
}: any) {
  return (
    <div className="space-y-2">
      <Label className="font-sans font-medium">Duration</Label>
      <div className="grid grid-cols-2 gap-2">
        {durations.map((d: any) => (
          <Button
            key={d.value}
            type="button"
            variant={
              !isCustomDuration && dcaData.duration === d.value
                ? "default"
                : "outline"
            }
            size="sm"
            className={`font-sans text-xs ${
              !isCustomDuration && dcaData.duration === d.value
                ? "bg-blue-600 hover:bg-blue-700"
                : "hover:bg-blue-50 hover:border-blue-300"
            }`}
            onClick={() => {
              setDcaData({ ...dcaData, duration: d.value });
              setIsCustomDuration(false);
              setCustomDuration("");
            }}
          >
            {d.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Button
          type="button"
          variant={isCustomDuration ? "default" : "outline"}
          size="sm"
          className={`font-sans text-xs ${
            isCustomDuration
              ? "bg-blue-600 hover:bg-blue-700"
              : "hover:bg-blue-50 hover:border-blue-300"
          }`}
          onClick={() => {
            setIsCustomDuration(true);
            if (customDuration)
              setDcaData({ ...dcaData, duration: customDuration });
          }}
        >
          Custom
        </Button>
        {isCustomDuration && (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              placeholder="e.g. 18"
              value={customDuration}
              onChange={(e) => {
                const v = e.target.value;
                setCustomDuration(v);
                const n = parseInt(v);
                if (!isNaN(n) && n >= 1 && n <= 240) {
                  setDcaData({ ...dcaData, duration: v });
                } else if (v === "") {
                  setDcaData({ ...dcaData, duration: "12" });
                }
              }}
              className="text-xs h-8 w-20 font-mono"
              min="1"
              max="240"
              step="1"
            />
            <span className="text-xs text-muted-foreground font-sans">
              months
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function GrowthPicker({
  yearlyGrowthPrediction,
  setYearlyGrowthPrediction,
  customGrowth,
  setCustomGrowth,
  isCustomGrowth,
  setIsCustomGrowth,
}: any) {
  const presets = [5, 15, 25, 50, 75, 100];
  return (
    <div className="space-y-2">
      <Label className="font-sans font-medium">BTC Growth Prediction</Label>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((g: number) => (
          <Button
            key={g}
            type="button"
            variant={
              !isCustomGrowth && yearlyGrowthPrediction === g
                ? "default"
                : "outline"
            }
            size="sm"
            className={`font-sans text-xs ${
              !isCustomGrowth && yearlyGrowthPrediction === g
                ? "bg-orange-600 hover:bg-orange-700"
                : "hover:bg-orange-50 hover:border-orange-300"
            }`}
            onClick={() => {
              setYearlyGrowthPrediction(g);
              setIsCustomGrowth(false);
              setCustomGrowth("");
            }}
          >
            {g}%
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Button
          type="button"
          variant={isCustomGrowth ? "default" : "outline"}
          size="sm"
          className={`font-sans text-xs ${
            isCustomGrowth
              ? "bg-orange-600 hover:bg-orange-700"
              : "hover:bg-orange-50 hover:border-orange-300"
          }`}
          onClick={() => {
            setIsCustomGrowth(true);
            if (customGrowth)
              setYearlyGrowthPrediction(parseFloat(customGrowth));
          }}
        >
          Custom
        </Button>
        {isCustomGrowth && (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              placeholder="e.g. 37.5"
              value={customGrowth}
              onChange={(e) => {
                const v = e.target.value;
                setCustomGrowth(v);
                const n = parseFloat(v);
                if (!isNaN(n) && n >= 0 && n <= 1000) {
                  setYearlyGrowthPrediction(n);
                } else if (v === "") {
                  setYearlyGrowthPrediction(25);
                }
              }}
              className="text-xs h-8 w-28 font-mono"
              min="0"
              max="1000"
              step="0.1"
            />
            <span className="text-xs text-muted-foreground font-sans">
              % annually
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
