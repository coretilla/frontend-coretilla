"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe, TrendingUp } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useBTCPrice } from "@/contexts/BTCPriceContext";

export default function Hero() {
  const { priceData, isLoading, error } = useBTCPrice();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200"
      >
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6A00' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Bitcoin Icons */}

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute top-1/3 right-1/3 hidden sm:block"
        >
          <TrendingUp className="w-4 h-4 text-primary/40 animate-bounce" style={{ animationDelay: '1s' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-1/4 left-1/3 hidden sm:block"
        >
          <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="absolute bottom-1/3 right-1/4 hidden sm:block"
        >
          <Image src="/image/btcLogo.png" alt="Bitcoin" width={12} height={12} className="object-contain opacity-60 animate-bounce" style={{ animationDelay: '0.7s' }} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-sans leading-tight"
            >
              Bitcoin
              <span className="block text-primary bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Neobank
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 font-sans font-normal"
            >
              Your digital bank for the Bitcoin economy. Simple, secure, and designed for everyone - 
              from crypto beginners to Bitcoin veterans.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold group font-sans"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold font-sans"
                >
                  Try Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
              >
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium font-sans">Bank-Grade Security</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
              >
                <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium font-sans">Instant Transactions</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.4 }}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
              >
                <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium font-sans">Global Access</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - Bitcoin Graphics */}
          <div className="relative lg:order-last">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="relative max-w-lg mx-auto"
            >
              {/* Main Bitcoin Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-orange-200/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                {/* Bitcoin Logo */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Image src="/image/btcLogo.png" alt="Bitcoin" width={64} height={64} className="object-contain" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full"
                    ></motion.div>
                  </div>
                </div>

                {/* Bitcoin Stats */}
                <div className="grid grid-cols-1 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-primary mb-2 font-mono">
                      {isLoading ? (
                        <div className="animate-pulse bg-primary/20 rounded w-32 h-8 mx-auto" />
                      ) : error ? (
                        "$—"
                      ) : priceData ? (
                        formatPrice(priceData.price)
                      ) : (
                        "$—"
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">Bitcoin Price</div>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.4 }}
                      className="text-center"
                    >
                      <div className={`text-xl font-bold mb-1 font-mono ${
                        isLoading ? 'text-muted-foreground' : 
                        error ? 'text-muted-foreground' :
                        priceData && priceData.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isLoading ? (
                          <div className="animate-pulse bg-muted rounded w-16 h-6 mx-auto" />
                        ) : error ? (
                          "—%"
                        ) : priceData ? (
                          `${priceData.changePercent > 0 ? '+' : ''}${priceData.changePercent.toFixed(2)}%`
                        ) : (
                          "—%"
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-sans">24h Change</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.4 }}
                      className="text-center"
                    >
                      <div className="text-xl font-bold text-foreground mb-1 font-mono">0.025</div>
                      <div className="text-xs text-muted-foreground font-sans">Your Balance</div>
                    </motion.div>
                  </div>
                </div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                  className="mt-6 grid grid-cols-2 gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                  >
                    Buy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-3 rounded-xl font-medium text-sm transition-colors"
                  >
                    Sell
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-200/50 hidden lg:block"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-semibold text-green-600">+15.2%</div>
                    <div className="text-xs text-muted-foreground">Portfolio</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, duration: 0.4 }}
                className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-200/50 hidden lg:block"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-semibold text-primary">Secured</div>
                    <div className="text-xs text-muted-foreground">Bank Level</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}