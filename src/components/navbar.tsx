"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bitcoin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BTCPriceViewer from "./btc-price-viewer";
import MobileMenu from "./mobile-menu";
import MenuGroupDropdown from "./menu-group-dropdown";
import { navGroups, quickAccessItems } from "@/config/navItems";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Bitcoin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-sans">
              Coretilla
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Quick Access Items */}
            {quickAccessItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-sans font-medium text-sm ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* Grouped Dropdowns */}
            {navGroups.map((group) => (
              <MenuGroupDropdown key={group.title} group={group} />
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <BTCPriceViewer />
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="hover:text-primary font-sans font-medium">
                Sign In
              </Button>
              <Button className="bg-primary hover:bg-primary/90 font-sans font-semibold">
                Register
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <div className="sm:hidden">
              <BTCPriceViewer />
            </div>
            <MobileMenu 
              isOpen={isMobileMenuOpen} 
              onOpenChange={setIsMobileMenuOpen}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}