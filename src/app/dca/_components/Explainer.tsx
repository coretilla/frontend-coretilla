"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Explainer({
  startingPrice,
}: {
  startingPrice: string;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="font-sans">
          Understanding Your DCA Analysis
        </CardTitle>
        <CardDescription className="font-sans">
          We provide two different calculations to help you understand potential
          outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Block
            title="📊 Expected Returns Preview"
            badge="Quick Estimate"
            color="green"
            bullets={[
              "Instant calculation as you type",
              "Perfect growth assumption (smooth curve)",
              "No market volatility included",
              "Best-case scenario estimation",
            ]}
          />
          <Block
            title="🎯 Investment Projection"
            badge="Realistic Simulation"
            color="blue"
            bullets={[
              "Detailed simulation after running DCA",
              "Includes market volatility (±10% swings)",
              "Month-by-month analysis with real variations",
              "Real-world scenario simulation",
            ]}
          />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-800 mb-1">
            💡 Which one to trust?
          </div>
          <div className="text-xs text-gray-600">
            Use <strong>Expected Returns Preview</strong> for quick planning and{" "}
            <strong>Investment Projection</strong> for realistic expectations.
            The projection will usually be different due to market volatility.
            Starting price: {startingPrice}.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Block({
  title,
  badge,
  color,
  bullets,
}: {
  title: string;
  badge: string;
  color: "green" | "blue";
  bullets: string[];
}) {
  const colorMap = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      pill: "bg-green-100 text-green-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      pill: "bg-blue-100 text-blue-600",
    },
  } as const;
  const c = colorMap[color];
  return (
    <div className={`p-4 rounded-lg border ${c.bg} ${c.border}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-sm font-semibold ${c.text}`}>{title}</span>
        <span className={`text-xs ${c.pill} px-2 py-0.5 rounded`}>{badge}</span>
      </div>
      <div className={`text-xs ${c.text} space-y-1`}>
        {bullets.map((b) => (
          <div key={b}>
            • <strong>{b.split(" ")[0]}</strong> {b.slice(b.indexOf(" ") + 1)}
          </div>
        ))}
      </div>
    </div>
  );
}
