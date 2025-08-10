import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssetCardProps {
  title: string;
  icon?: React.ReactNode;
  logoSrc?: string;
  amountText: string;
  usdValueText?: string;
  priceText?: string;
  priceTooltip?: string;
  delay?: number;
}

export function AssetCard({
  title,
  icon,
  logoSrc,
  amountText,
  usdValueText,
  priceText,
  priceTooltip,
  delay = 0.1,
}: AssetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all hover:border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-sans flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </span>
            {title}
          </CardTitle>
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={title}
              width={28}
              height={28}
              className="object-contain"
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono tracking-tight">
            {amountText}
          </div>

          {(usdValueText || priceText) && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground font-sans">
                {usdValueText ?? "\u00A0"}
              </p>

              {priceText ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground font-mono cursor-help">
                        {priceText}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      {priceTooltip ?? "Latest price"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">
                  &nbsp;
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}