import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowUpDown, 
  Coins, 
  TrendingUp, 
  CreditCard, 
  QrCode,
  BarChart3,
  DollarSign,
  Percent,
  Bot,
  Activity,
  UserCheck,
  Zap
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Deposit Fiat",
    description: "Easily deposit USD, EUR, and other fiat currencies directly to your account",
    color: "bg-blue-100 text-blue-600",
    comingSoon: false
  },
  {
    icon: ArrowUpDown,
    title: "Swap Fiat to BTC",
    description: "Convert your fiat currency to Bitcoin on the Core network with competitive rates",
    color: "bg-orange-100 text-orange-600",
    comingSoon: false
  },
  {
    icon: Coins,
    title: "Mock BTC & USDT",
    description: "Trade with mock Bitcoin and USDT on the Core chain for testing purposes",
    color: "bg-yellow-100 text-yellow-600",
    comingSoon: false
  },
  {
    icon: TrendingUp,
    title: "lstBTC Staking",
    description: "Convert BTC → lstBTC → Stake to earn istBTC rewards automatically",
    color: "bg-green-100 text-green-600",
    comingSoon: false
  },
  {
    icon: Wallet,
    title: "Lending & Borrowing",
    description: "Lend your Bitcoin to earn interest or borrow against your crypto holdings",
    color: "bg-purple-100 text-purple-600",
    comingSoon: true
  },
  {
    icon: QrCode,
    title: "QR & Barcode Payments",
    description: "Deposit, transfer, and withdraw using QR codes and barcode scanning",
    color: "bg-indigo-100 text-indigo-600",
    comingSoon: false
  },
  {
    icon: BarChart3,
    title: "Balance Tracking",
    description: "Real-time portfolio tracking with detailed analytics and insights",
    color: "bg-red-100 text-red-600",
    comingSoon: false
  },
  {
    icon: DollarSign,
    title: "DCA Investment",
    description: "Dollar-Cost Averaging strategy for automated Bitcoin investments",
    color: "bg-teal-100 text-teal-600",
    comingSoon: false
  },
  {
    icon: Percent,
    title: "Interest Rate Model",
    description: "Flexible APY with adjustable interest rates based on market conditions",
    color: "bg-pink-100 text-pink-600",
    comingSoon: true
  },
  {
    icon: Bot,
    title: "AI Spending Analyzer",
    description: "Smart AI assistant that analyzes your spending patterns and provides insights",
    color: "bg-cyan-100 text-cyan-600",
    comingSoon: true
  },
  {
    icon: Activity,
    title: "Real-time BTC Price",
    description: "Live Bitcoin price updates with advanced charting and market data",
    color: "bg-orange-100 text-orange-600",
    comingSoon: false
  },
  {
    icon: UserCheck,
    title: "Gmail Login",
    description: "Account Abstraction: Login with Gmail and auto-create wallet using Reown SDK",
    color: "bg-green-100 text-green-600",
    comingSoon: true
  },
  {
    icon: Zap,
    title: "Gasless Transactions",
    description: "Execute transactions without worrying about gas fees - we handle it for you",
    color: "bg-yellow-100 text-yellow-600",
    comingSoon: true
  }
];

export default function Features() {
  return (
    <div id="features" className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-sans">
            Everything you need for 
            <span className="text-primary"> Bitcoin banking</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-sans font-normal">
            Comprehensive suite of financial tools designed to make Bitcoin accessible 
            and easy to use for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground font-sans">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4 font-sans font-normal">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant={feature.comingSoon ? "secondary" : "outline"}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-sans font-medium"
                    disabled={feature.comingSoon}
                  >
                    {feature.comingSoon ? "Coming Soon" : "Learn More"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-sans">
              Ready to start your Bitcoin journey?
            </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto font-sans font-normal">
              Join thousands of users who trust Bitcoin Neobank for their digital banking needs. 
              Get started in minutes with our simple onboarding process.
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-sans font-semibold">
              Open Account Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}