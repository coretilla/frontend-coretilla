"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { mobileNavSections, quickAccessItems } from "@/config/navItems";
import { Menu, ChevronDown, Bitcoin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BTCPriceViewer from "./btc-price-viewer";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileMenu({ isOpen, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(
    mobileNavSections.filter(section => section.defaultOpen).map(section => section.title)
  );

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
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
              <Bitcoin className="h-6 w-6 text-primary" />
              Bitcoin Neobank
            </SheetTitle>
            <div className="mt-4">
              <BTCPriceViewer />
            </div>
          </SheetHeader>

          <Separator />

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-2">
              {/* Quick Access Items */}
              {quickAccessItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="font-medium font-sans">{item.name}</span>
                  </Link>
                );
              })}

              {/* Grouped Sections */}
              {mobileNavSections.map((section) => {
                const isOpen = openSections.includes(section.title);
                const hasActiveItem = section.items.some(item => pathname === item.href);
                
                return (
                  <Collapsible
                    key={section.title}
                    open={isOpen}
                    onOpenChange={() => toggleSection(section.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-between px-4 py-3 h-auto rounded-lg font-sans font-medium ${
                          hasActiveItem 
                            ? "bg-primary/5 text-primary" 
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{section.emoji}</span>
                          <span>{section.title}</span>
                        </div>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`} 
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {section.items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3 px-4 py-3 ml-8 rounded-lg transition-all duration-200 ${
                              isActive 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <IconComponent className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="flex-1">
                              <div className="font-medium font-sans text-sm">{item.name}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground font-sans">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </nav>
          </div>

          <Separator />

          {/* Footer - Auth Buttons */}
          <div className="p-6 pt-4 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-center font-sans font-medium"
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