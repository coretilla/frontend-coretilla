"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Key, Lock, Rocket, Award, Star, Users, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useBTCPrice } from "@/hooks";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserData } from "@/lib/api";
import Link from "next/link";

export default function Hero() {
  const { priceData, isLoading, error } = useBTCPrice();
  const { isAuthenticated } = useAuth();
  const [wbtcBalance, setWbtcBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Fetch WBTC balance from API
  const fetchWbtcBalance = async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingBalance(true);
    try {
      const userData = await getUserData();
      setWbtcBalance(userData.wbtcBalance || 0);
    } catch (error) {
      console.error('Failed to fetch WBTC balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchWbtcBalance();
  }, [isAuthenticated]);

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
          <TrendingUp className="w-4 h-4 text-primary/40" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-1/4 left-1/3 hidden sm:block"
        >
          <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="absolute bottom-1/3 right-1/4 hidden sm:block"
        >
          <Image src="/image/btcLogo.png" alt="Bitcoin" width={12} height={12} className="object-contain opacity-60" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Enhanced Hero Title */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative mb-8"
              >
                {/* Main Title with Enhanced Styling */}
                <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground font-sans leading-[0.9] tracking-tight">
                  {/* Bitcoin Text with Subtle Glow */}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      Bitcoin
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-transparent blur-xl"></div>
                  </span>
                  
                  {/* Neobank Text with Enhanced Gradient */}
                  <span className="block relative mt-2">
                    <span className="relative z-10 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent font-extrabold">
                      Neobank
                    </span>
                    {/* Glowing Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 via-orange-500/30 to-orange-600/30 blur-2xl"></div>
                    {/* Accent Line */}
                    <div className="absolute -bottom-2 left-0 w-24 sm:w-32 md:w-40 lg:w-48 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                  </span>
                </h1>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-400/10 rounded-full blur-xl hidden lg:block"></div>
                <div className="absolute top-1/2 -left-8 w-24 h-24 bg-orange-300/5 rounded-full blur-2xl hidden lg:block"></div>
              </motion.div>

              {/* Enhanced Description */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative mb-8"
              >
                <div className="max-w-2xl mx-auto lg:mx-0">
                  {/* Main Description */}
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-muted-foreground font-sans font-normal leading-relaxed mb-4">
                    Your <span className="text-orange-600 font-semibold">digital bank</span> for the Bitcoin economy.
                  </p>
                  
                  {/* Enhanced User Type Pills */}
                  <div className="flex flex-col gap-4">
                    <p className="text-base sm:text-lg text-muted-foreground/80 font-medium">
                      Simple, secure, and designed for everyone:
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {/* Crypto Beginners Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 25px -5px rgba(34, 197, 94, 0.3)"
                        }}
                        className="group flex items-center gap-3 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/60 rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer flex-1 sm:flex-initial"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-green-200/70 rounded-lg group-hover:bg-green-300/70 transition-colors duration-300">
                          <Rocket className="w-4 h-4 text-green-700 group-hover:text-green-800 transition-colors duration-300" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-green-800 group-hover:text-green-900 transition-colors duration-300">
                            Crypto Beginners
                          </span>
                          <span className="text-xs text-green-600/80 font-medium">
                            Start your journey
                          </span>
                        </div>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                        </div>
                      </motion.div>

                      {/* Connector */}
                      <div className="hidden sm:flex items-center justify-center px-2">
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
                          <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        </div>
                      </div>

                      {/* Bitcoin Veterans Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.4 }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 8px 25px -5px rgba(249, 115, 22, 0.3)"
                        }}
                        className="group flex items-center gap-3 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/60 rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer flex-1 sm:flex-initial"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-200/70 rounded-lg group-hover:bg-orange-300/70 transition-colors duration-300">
                          <Award className="w-4 h-4 text-orange-700 group-hover:text-orange-800 transition-colors duration-300" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-orange-800 group-hover:text-orange-900 transition-colors duration-300">
                            Bitcoin Veterans
                          </span>
                          <span className="text-xs text-orange-600/80 font-medium">
                            Advanced features
                          </span>
                        </div>
                        <div className="ml-auto">
                          <Star className="w-3 h-3 text-orange-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Background Accent */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-2xl blur-3xl"></div>
              </motion.div>
            </div>

            {/* Minimalist CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
            >
              {/* Primary CTA - Get Started */}
              <Link href='/deposit'>
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px -8px rgba(249, 115, 22, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-300" />
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </motion.button>
              </Link>

              <Link href='#features'>
               <motion.button
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(249, 115, 22, 0.05)"
                }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer group relative bg-transparent border border-orange-200 text-orange-700 hover:text-orange-800 px-6 py-3 rounded-lg font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 hover:border-orange-300 min-w-[120px]"
              >
                <Play className="w-3.5 h-3.5 transition-colors group-hover:text-orange-600 duration-300" />
                <span>Neobank Features</span>
                
                {/* Subtle background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50/0 via-orange-50/50 to-orange-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </motion.button>
              </Link>
             
            </motion.div>

            {/* Enhanced Feature Pills - Web3 Native */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 mt-8"
            >
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
                    <div>
                      <Image src="/image/btcLogo.png" alt="Bitcoin" width={64} height={64} className="object-contain" />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full"></div>
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
                      <div className="text-xl font-bold text-foreground mb-1 font-mono">
                        {isLoadingBalance ? (
                          <div className="animate-pulse bg-muted rounded w-20 h-6 mx-auto" />
                        ) : isAuthenticated ? (
                          wbtcBalance.toFixed(8)
                        ) : (
                          "0.00000000"
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-sans">
                        {isAuthenticated ? "Your WBTC Balance" : "Your Balance"}
                      </div>
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
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground">0.0%</div>
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
                  <Lock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-semibold text-primary">Not Your Keys</div>
                    <div className="text-xs text-muted-foreground">Not Your Coins</div>
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