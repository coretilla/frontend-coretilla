"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BTCPrice from "./navbar/BTCPrice";
import { ConnectWallet } from "./wallet/ConnectWallet";
import { navGroups } from "@/lib/navItems";
import { useNavigation, useRouteLoader } from "@/hooks";

interface MobileDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileDrawer({ isOpen, onOpenChange }: MobileDrawerProps) {
  const { activeRoute, closeMobileMenu } = useNavigation();
  const { navigateWithLoader } = useRouteLoader();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Transactions": true,
    "Investing": true,
    "Tools": true,
  });

  const handleLinkClick = (href: string) => {
    closeMobileMenu();
    navigateWithLoader(href);
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold font-sans">
              <Image src="/image/btcLogo.png" alt="Bitcoin" width={24} height={24} className="object-contain" />
              Bitcoin Neobank
            </SheetTitle>
            <div className="mt-4">
              <BTCPrice showDropdown={false} />
            </div>
          </SheetHeader>

          <Separator />

          {/* Navigation - Grouped Sections */}
          <div className="flex-1 overflow-y-auto p-6">
            <motion.nav 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {navGroups.map((group, groupIndex) => {
                const isGroupOpen = openGroups[group.name];
                const hasActiveItem = group.items.some(item => activeRoute === item.href);
                
                return (
                  <motion.div
                    key={group.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + groupIndex * 0.1 }}
                    className="space-y-2"
                  >
                    <Collapsible open={isGroupOpen} onOpenChange={() => toggleGroup(group.name)}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <group.icon className="h-8 w-8" />
                          <span className={`font-semibold font-sans ${
                            hasActiveItem ? "text-primary" : "text-foreground"
                          }`}>
                            {group.name}
                          </span>
                        </div>
                        {isGroupOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pl-6">
                        {group.items.map((item, itemIndex) => {
                          const IconComponent = item.icon;
                          const isActive = activeRoute === item.href;
                          
                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + itemIndex * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <button
                                onClick={() => handleLinkClick(item.href)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${
                                  isActive 
                                    ? "bg-primary text-primary-foreground" 
                                    : "hover:bg-muted text-foreground"
                                }`}
                              >
                                <IconComponent className={`h-5 w-5 ${
                                  isActive ? "text-primary-foreground" : "text-primary"
                                }`} />
                                <span className={`font-medium font-sans ${
                                  isActive ? "text-primary-foreground" : "text-foreground"
                                }`}>
                                  {item.name}
                                </span>
                              </button>
                            </motion.div>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                );
              })}
            </motion.nav>
          </div>

          <Separator />

          {/* Footer - Auth Buttons */}
          <motion.div 
            className="p-6 pt-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="font-sans font-medium"
                onClick={() => closeMobileMenu()}
              >
                Sign In
              </Button>
              <Button 
                className="font-sans font-medium"
                onClick={() => closeMobileMenu()}
              >
                Register
              </Button>
            </div>
            <ConnectWallet 
              className="w-full justify-center font-sans font-medium"
            />
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}