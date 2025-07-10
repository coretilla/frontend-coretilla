"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { mobileNavSections } from "@/config/navItems";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BTCPriceViewer from "./btc-price-viewer";

interface MobileDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileDrawer({ isOpen, onOpenChange }: MobileDrawerProps) {
  const handleLinkClick = () => {
    onOpenChange(false);
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
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-xl font-bold font-sans">
                <Image src="/image/btcLogo.png" alt="Bitcoin" width={24} height={24} className="object-contain" />
                Bitcoin Neobank
              </SheetTitle>
            </div>
            <div className="mt-4">
              <BTCPriceViewer />
            </div>
          </SheetHeader>

          <Separator />

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-6">
              {mobileNavSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{section.emoji}</span>
                    <h3 className="font-semibold text-foreground font-sans">
                      {section.title}
                    </h3>
                  </div>
                  <div className="pl-6 space-y-1">
                    {section.items.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors duration-200 group"
                        >
                          <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground font-sans">
                              {item.name}
                            </div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground font-sans">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <Separator />

          {/* Footer - Auth Buttons */}
          <div className="p-6 pt-4 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start font-sans font-medium"
              onClick={handleLinkClick}
            >
              Sign In
            </Button>
            <Button
              className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
              onClick={handleLinkClick}
            >
              Register
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}