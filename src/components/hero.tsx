import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6A00' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-bounce hidden sm:block"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary/60 rounded-full animate-bounce delay-1000 hidden sm:block"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary rounded-full animate-bounce delay-500 hidden sm:block"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-primary/80 rounded-full animate-bounce delay-700 hidden sm:block"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 font-sans leading-tight">
            Buy Bitcoin as easy as{" "}
            <span className="text-primary bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              shopping online
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 font-sans font-normal px-2">
            Your digital bank for the Bitcoin economy. Simple, secure, and designed for everyone - 
            from crypto beginners to Bitcoin veterans.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold group font-sans w-full sm:w-auto"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold font-sans w-full sm:w-auto"
          >
            Learn More
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4 sm:px-0">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mx-auto sm:mx-0">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="text-foreground font-medium font-sans text-sm sm:text-base">Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mx-auto sm:mx-0">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="text-foreground font-medium font-sans text-sm sm:text-base">Instant Transactions</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mx-auto sm:mx-0">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="text-foreground font-medium font-sans text-sm sm:text-base">Global Access</span>
          </div>
        </div>

        {/* Mock Phone/Dashboard Preview */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-orange-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center py-2 sm:py-0">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2 font-mono">$100,000</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-sans">Bitcoin Price</div>
              </div>
              <div className="text-center py-2 sm:py-0">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2 font-mono">+12.4%</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-sans">24h Change</div>
              </div>
              <div className="text-center py-2 sm:py-0">
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 font-mono">0.025</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-sans">Your BTC Balance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}