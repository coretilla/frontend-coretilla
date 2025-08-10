"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Mail,
  Copy,
  ExternalLink,
  LogOut,
  CheckCircle,
  Loader2,
  Shield,
  Zap,
  Chrome,
  Smartphone,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useAccount } from "wagmi";
import { toast } from "sonner";

interface ConnectWalletProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ConnectWallet({
  variant = "default",
  size = "default",
  className = "",
}: ConnectWalletProps) {
  const {
    isConnected,
    isConnecting,
    address,
    smartAccountAddress,
    balance,
    connect,
    disconnect,
    chainId,
  } = useWallet();

  // Get additional account info including connector details
  const { connector } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy address");
    }
  };

  // Check if this is a smart wallet (social login)
  const isSmartWallet =
    connector?.name?.toLowerCase().includes("smart") ||
    connector?.name?.toLowerCase().includes("social") ||
    connector?.id?.includes("coinbaseWallet") ||
    connector?.id?.includes("w3mEmail");

  // Handle disconnect
  const handleDisconnect = async () => {
    await disconnect();
    setIsModalOpen(false);
    toast.success("Wallet disconnected");
  };

  // If connected, show wallet info
  if (isConnected && address) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`relative overflow-hidden ${className}`}
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-mono text-sm">
                {formatAddress(smartAccountAddress || address || "")}
              </span>
            </motion.div>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Connected Wallet
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Wallet Type & Address */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {isSmartWallet ? "Smart Account Address" : "Wallet Address"}
                </span>
                <div className="flex items-center gap-2">
                  {isSmartWallet && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Smart Wallet
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    Chain ID: {chainId}
                  </Badge>
                </div>
              </div>

              {isSmartWallet && (
                <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded-lg border-l-2 border-blue-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Mail className="w-3 h-3 text-blue-500" />
                    <span>
                      This is your smart contract wallet address created from
                      your Gmail/social login
                    </span>
                  </div>
                  <div className="text-xs text-orange-600 font-medium">
                    ⚠️ Make sure you have CORE tokens for transaction gas fees
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <code className="flex-1 text-sm font-mono break-all">
                  {smartAccountAddress || address}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const addressToCopy = smartAccountAddress || address;
                    if (!addressToCopy) return;

                    navigator.clipboard
                      .writeText(addressToCopy)
                      .then(() => {
                        setCopied(true);
                        toast.success("Smart Account Address copied!");
                        setTimeout(() => setCopied(false), 2000);
                      })
                      .catch(() => {
                        toast.error("Failed to copy address");
                      });
                  }}
                  className="p-2 h-8 w-8"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Address Info */}
              {isSmartWallet &&
                smartAccountAddress &&
                smartAccountAddress !== address && (
                  <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded border-l-2 border-gray-200">
                    <div className="font-medium text-gray-700 mb-1">
                      Address Details:
                    </div>
                    <div>
                      <span className="font-mono text-xs">Smart Account:</span>{" "}
                      {smartAccountAddress}
                    </div>
                    <div>
                      <span className="font-mono text-xs">EOA (Owner):</span>{" "}
                      {address}
                    </div>
                  </div>
                )}

              {/* Connector Info */}
              {connector && (
                <div className="text-xs text-muted-foreground">
                  Connected via:{" "}
                  <span className="font-mono">{connector.name}</span>
                </div>
              )}
            </div>

            {/* Balance */}
            {balance && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Balance
                </span>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold font-mono">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyAddress}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const explorerAddress = smartAccountAddress || address;
                  window.open(
                    `https://scan.coredao.org/address/${explorerAddress}`,
                    "_blank"
                  );
                }}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>

            {/* Disconnect */}
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  // If not connected, show connect options
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`relative overflow-hidden ${className}`}
          disabled={isConnecting}
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </motion.div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Connect Your Wallet</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Connect Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => {
                connect();
                setIsModalOpen(false);
              }}
              className="w-full h-14 text-base bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Mail className="w-5 h-5 mr-3" />
              )}
              Sign In with Email/Google
            </Button>
          </motion.div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              <span>No wallet app needed - we create one for you</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Gasless transactions with Account Abstraction</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Chrome className="w-4 h-4 text-blue-500" />
              <span>Works with Google account login</span>
            </div>
          </div>

          {/* Alternative */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or connect traditional wallet
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={() => {
                connect();
                setIsModalOpen(false);
              }}
              className="w-full h-12"
              disabled={isConnecting}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              MetaMask, WalletConnect & More
            </Button>
          </motion.div>

          {/* Security Note */}
          <div className="text-xs text-center text-muted-foreground px-4">
            Your wallet is secured by bank-grade security and Account
            Abstraction technology. We never store your private keys.
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
