"use client";

import { motion } from "framer-motion";
import { Loader2, Bitcoin } from "lucide-react";
import Image from "next/image";

interface RouteLoaderProps {
  show: boolean;
  variant?: "spinner" | "skeleton";
}

export default function RouteLoader({ show, variant = "spinner" }: RouteLoaderProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      {variant === "spinner" ? (
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Image 
              src="/image/btcLogo.png" 
              alt="Bitcoin" 
              width={48} 
              height={48} 
              className="object-contain"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-muted-foreground"
          >
            Loading...
          </motion.div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="animate-pulse bg-gray-300 rounded-full w-8 h-8" />
              <div className="animate-pulse bg-gray-300 rounded w-32 h-4" />
            </div>
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-300 rounded w-full h-4" />
              <div className="animate-pulse bg-gray-300 rounded w-3/4 h-4" />
              <div className="animate-pulse bg-gray-300 rounded w-1/2 h-4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="animate-pulse bg-gray-300 rounded-lg h-16" />
              <div className="animate-pulse bg-gray-300 rounded-lg h-16" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function RouteLoaderProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}