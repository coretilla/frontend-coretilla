"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  Shield,
  Clock,
  Globe,
  ChevronUp,
  Phone,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  products: [
    { name: "Buy Bitcoin", href: "/deposit" },
    { name: "Swap Crypto", href: "/swap" },
    { name: "Staking", href: "/stake" },
    { name: "Lending", href: "/lending" },
    { name: "DCA Strategy", href: "/dca" },
    { name: "Fiat Gateway", href: "/fiat" },
  ],
  tools: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Portfolio Analyzer", href: "/analyzer" },
    { name: "Price Alerts", href: "#" },
    { name: "Tax Reports", href: "#" },
    { name: "API Access", href: "#" },
    { name: "Mobile App", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press Kit", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Security", href: "#" },
    { name: "Status", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Community", href: "#" },
    { name: "Bug Reports", href: "#" },
    { name: "Feature Requests", href: "#" },
    { name: "Documentation", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Compliance", href: "#" },
    { name: "Licenses", href: "#" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "GitHub", icon: Github, href: "https://github.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Email", icon: Mail, href: "mailto:hello@bitcoinneobank.com" },
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "Your funds are protected by institutional-grade security measures",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your Bitcoin needs",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Access your Bitcoin from anywhere in the world, anytime",
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6A00' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10">
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="col-span-2 md:col-span-3 lg:col-span-2"
              >
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <Image
                    src="/image/btcLogo.png"
                    alt="Bitcoin"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <span className="text-xl font-bold text-foreground font-sans">
                    Bitcoin Neobank
                  </span>
                </Link>

                <p className="text-muted-foreground mb-6 font-sans max-w-xs">
                  The future of banking is here. Simple, secure, and designed
                  for the Bitcoin economy.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>hello@bitcoinneobank.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gray-100 hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors group"
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-4 font-sans">
                  Products
                </h3>
                <ul className="space-y-2">
                  {footerLinks.products.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-4 font-sans">
                  Tools
                </h3>
                <ul className="space-y-2">
                  {footerLinks.tools.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-4 font-sans">
                  Company
                </h3>
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-4 font-sans">
                  Support
                </h3>
                <ul className="space-y-2">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <Separator />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground font-sans">
                <span>&copy; 2024 Bitcoin Neobank. All rights reserved.</span>
                <div className="flex items-center gap-4">
                  {footerLinks.legal.slice(0, 3).map((link, index) => (
                    <span key={link.name} className="flex items-center">
                      <Link
                        href={link.href}
                        className="hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                      {index < 2 && (
                        <span className="ml-4 text-gray-300">|</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors group"
                aria-label="Back to top"
              >
                <ChevronUp className="w-5 h-5 text-primary" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </footer>
  );
}
