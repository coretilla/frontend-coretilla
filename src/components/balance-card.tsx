import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface BalanceCardProps {
  title: string;
  amount: string;
  symbol: string;
  change?: {
    value: number;
    percentage: number;
    period: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export default function BalanceCard({ 
  title, 
  amount, 
  symbol, 
  change, 
  icon,
  className = ""
}: BalanceCardProps) {
  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4" />;
    if (value < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-sans flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold font-mono text-foreground">
            {symbol}{amount}
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-sans ${getChangeColor(change.value)}`}>
              {getChangeIcon(change.value)}
              <span className="font-mono">
                {change.value > 0 ? '+' : ''}{change.value.toFixed(2)}
              </span>
              <span>({change.percentage > 0 ? '+' : ''}{change.percentage.toFixed(1)}%)</span>
              <span className="text-muted-foreground">{change.period}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}