import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpDown,
  TrendingUp,
  CreditCard,
  BarChart3,
  DollarSign,
  Percent,
  Activity,
  UserCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Deposit",
    description: "Deposit your crypto assets securely",
    icon: Wallet,
    href: "/deposit",
    ctaText: "Deposit Now",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Buy Bitcoin",
    description: "Swap your USD for Bitcoin easily",
    icon: ArrowUpDown,
    href: "/swap",
    ctaText: "Swap Tokens",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Bitcoin Staking",
    description: "Stake your Bitcoin to earn rewards",
    icon: TrendingUp,
    href: "/staking",
    ctaText: "Start Staking",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Lending & Borrowing",
    description: "Use your Bitcoin as collateral to borrow USDT",
    icon: Wallet,
    href: "/lending",
    ctaText: "Start Lending",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Balance Tracking",
    description: "Track your portfolio growth over time",
    icon: BarChart3,
    href: "/dashboard",
    ctaText: "View Dashboard",
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "DCA Simulation",
    description: "Plan your investment strategy",
    icon: DollarSign,
    href: "/dca",
    ctaText: "Try Simulator",
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function Features() {
  return (
    <div
      id="features"
      className="py-20 bg-gradient-to-b from-white to-orange-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-sans">
            Everything you need for
            <span className="text-primary"> Bitcoin banking</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-sans font-normal">
            Comprehensive suite of financial tools designed to make Bitcoin
            accessible and easy to use for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="cursor-pointer transition-all duration-200 hover:translate-y-[-4px]"
            >
              <Card className="h-full flex flex-col justify-between overflow-hidden group">
                <div>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${feature.color}`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="font-sans">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-sans mt-4">
                      {feature.description}
                    </p>
                  </CardContent>
                </div>
                <CardDescription className="flex items-center justify-between mt-3 ml-6">
                  <div className="relative w-[60%] overflow-hidden rounded-lg">
                    <div
                      className={`w-full py-2.5 px-4 bg-gradient-to-r ${feature.color} text-white font-medium text-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ease-out`}
                    >
                      {feature.ctaText}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardDescription>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-sans">
              Ready to start your Bitcoin journey?
            </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto font-sans font-normal">
              Join thousands of users who trust Bitcoin Neobank for their
              digital banking needs. Get started in minutes with our simple
              onboarding process.
            </p>
            <Link href="/swap">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 font-sans font-semibold cursor-pointer"
              >
                Buy your first Bitcoin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
