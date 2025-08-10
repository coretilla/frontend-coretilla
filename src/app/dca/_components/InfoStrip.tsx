"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Repeat, TrendingUp } from "lucide-react";

export default function IntroStrip() {
  const items = [
    {
      icon: TrendingUp,
      title: "DCA Bitcoin Simulation",
      desc: "Test Bitcoin purchases with realistic price data",
      color: "text-primary",
    },
    {
      icon: DollarSign,
      title: "Analyze Results",
      desc: "See detailed breakdown of your investment",
      color: "text-green-500",
    },
    {
      icon: Repeat,
      title: "Compare Scenarios",
      desc: "Try different amounts and frequencies",
      color: "text-blue-500",
    },
  ];
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="font-sans flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          DCA Bitcoin Simulation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="text-center p-4">
              <Icon className={`h-8 w-8 ${color} mx-auto mb-2`} />
              <div className="font-semibold font-sans mb-1">{title}</div>
              <div className="text-sm text-muted-foreground font-sans">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
