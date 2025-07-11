"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageTransition from "./PageTransition";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Persistent Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50"
      >
        <Navbar />
      </motion.div>

      {/* Main Content with Page Transitions */}
      <main className="flex-1 relative overflow-hidden">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Persistent Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}