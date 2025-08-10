"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "@/lib/motion/variants";
import { MenuGroupDropdownProps } from "@/app/types/navbar-types";

export default function MenuGroupDropdown({ group }: MenuGroupDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isGroupActive = group.items.some((item) => pathname === item.href);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-sans font-medium text-sm transition-all duration-200 hover:bg-primary/5 hover:text-primary ${
            isGroupActive ? "text-primary bg-primary/10" : "text-foreground"
          }`}
        >
          {group.title}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            className="w-64 p-2"
            align="start"
            sideOffset={4}
            asChild
          >
            <motion.div
              variants={dropdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {group.items.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;

                return (
                  <DropdownMenuItem key={item.name} asChild className="p-0">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            isActive ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium font-sans">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground font-sans">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  </DropdownMenuItem>
                );
              })}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}
