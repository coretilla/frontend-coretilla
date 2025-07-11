"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RouteLoader from "./ui/RouteLoader";
import Image from "next/image";
import BTCPrice from "./navbar/BTCPrice";
import MobileDrawer from "./MobileDrawer";
import { ConnectWallet } from "./wallet/ConnectWallet";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navGroups } from "@/lib/navItems";
import { useNavigation, useScroll, useRouteLoader } from "@/hooks";

export default function Navbar() {
  const { mobileMenuOpen, activeRoute, toggleMobileMenu } = useNavigation();
  const { isScrolled } = useScroll(10);
  const { navigateWithLoader, isNavigating } = useRouteLoader();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Image src="/image/btcLogo.png" alt="Bitcoin" width={32} height={32} className="object-contain" />
              </motion.div>
              <span className="text-xl font-bold text-foreground font-sans">
            Coretilla
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Grouped Dropdowns */}
          <motion.div 
            className="hidden lg:flex items-center space-x-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {navGroups.map((group, groupIndex) => {
              const hasActiveItem = group.items.some(item => activeRoute === item.href);
              
              return (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + groupIndex * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`flex items-center gap-2 px-3 py-2 h-auto font-sans font-medium text-sm ${
                          hasActiveItem
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        <span className="text-sm">{group.emoji}</span>
                        {group.name}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {group.items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeRoute === item.href;
                        
                        return (
                          <DropdownMenuItem key={item.name} asChild>
                            <button
                              onClick={() => navigateWithLoader(item.href)}
                              className={`flex items-center gap-3 px-3 py-2 cursor-pointer w-full text-left ${
                                isActive ? "bg-primary/10 text-primary" : ""
                              }`}
                            >
                              <IconComponent className="h-4 w-4" />
                              {item.name}
                            </button>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Desktop Right Side - BTC Price + Connect Wallet */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <BTCPrice />
            <ConnectWallet 
              variant="ghost" 
              className="hover:text-primary font-sans font-medium"
            />
          </motion.div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <div className="hidden sm:block">
              <BTCPrice showDropdown={false} />
            </div>
            <MobileDrawer 
              isOpen={mobileMenuOpen} 
              onOpenChange={toggleMobileMenu}
            />
          </div>
        </div>
      </div>
      <RouteLoader show={isNavigating} />
    </motion.nav>
  );
}