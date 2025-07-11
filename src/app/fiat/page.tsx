"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Scan, Building2, CreditCard, Send, Download } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";

interface FiatTransactionData {
  type: "deposit" | "transfer" | "withdraw";
  amount: string;
  currency: string;
  method: string;
  recipient?: string;
  accountNumber?: string;
  bankName?: string;
}

export default function FiatPage() {
  const [transactionData, setTransactionData] = useState<FiatTransactionData>({
    type: "deposit",
    amount: "",
    currency: "USD",
    method: "",
    recipient: "",
    accountNumber: "",
    bankName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "EUR", name: "Euro", symbol: "€" },
  ];

  const balances = {
    USD: 1250.00,
    IDR: 18750000,
    EUR: 1100.50,
  };

  const depositMethods = [
    { id: "bank_transfer", name: "Bank Transfer", icon: Building2 },
    { id: "virtual_account", name: "Virtual Account", icon: CreditCard },
    { id: "qris", name: "QRIS", icon: QrCode },
  ];

  const generateQRCode = () => {
    // Mock QR code generation
    const mockQRData = `PAY:${transactionData.currency}${transactionData.amount}:${Date.now()}`;
    setQrCodeData(mockQRData);
    setShowQRCode(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionData.amount || !transactionData.currency) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (transactionData.type === "withdraw" || transactionData.type === "transfer") {
      const balance = balances[transactionData.currency as keyof typeof balances];
      if (parseFloat(transactionData.amount) > balance) {
        toast.error("Insufficient balance");
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${transactionData.type.charAt(0).toUpperCase() + transactionData.type.slice(1)} request submitted successfully!`);
      
      // Reset form
      setTransactionData({
        type: transactionData.type,
        amount: "",
        currency: "USD",
        method: "",
        recipient: "",
        accountNumber: "",
        bankName: "",
      });
    }, 2000);
  };

  const selectedCurrency = currencies.find(c => c.code === transactionData.currency);

  return (
    <PageWrapper 
      title="Fiat Transactions"
      subtitle="Deposit, transfer, and withdraw fiat currency with QR support"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-4xl mx-auto">

        {/* Balance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans">Current Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currencies.map((currency) => (
                <div key={currency.code} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary font-mono">
                    {currency.symbol}{balances[currency.code as keyof typeof balances].toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">{currency.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Fiat Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={transactionData.type} 
              onValueChange={(value) => setTransactionData({...transactionData, type: value as typeof transactionData.type})}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="deposit" className="font-sans">Deposit</TabsTrigger>
                <TabsTrigger value="transfer" className="font-sans">Transfer</TabsTrigger>
                <TabsTrigger value="withdraw" className="font-sans">Withdraw</TabsTrigger>
              </TabsList>

              <TabsContent value="deposit" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">Deposit Fiat</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Add money to your account using various payment methods
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Currency</Label>
                      <Select 
                        value={transactionData.currency} 
                        onValueChange={(value) => setTransactionData({...transactionData, currency: value})}
                      >
                        <SelectTrigger className="font-sans">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code} className="font-sans">
                              {currency.symbol} {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                          {selectedCurrency?.symbol}
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={transactionData.amount}
                          onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                          className="pl-8 font-mono"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-medium">Payment Method</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {depositMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <div
                            key={method.id}
                            className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                              transactionData.method === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setTransactionData({...transactionData, method: method.id})}
                          >
                            <IconComponent className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <div className="font-medium font-sans">{method.name}</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              transactionData.method === method.id
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 font-sans font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Deposit"}
                    </Button>
                    {transactionData.method === "qris" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateQRCode}
                        className="font-sans font-medium"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR
                      </Button>
                    )}
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="transfer" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">Transfer Money</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Send money to another user with QR code support
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Currency</Label>
                      <Select 
                        value={transactionData.currency} 
                        onValueChange={(value) => setTransactionData({...transactionData, currency: value})}
                      >
                        <SelectTrigger className="font-sans">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code} className="font-sans">
                              {currency.symbol} {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                          {selectedCurrency?.symbol}
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={transactionData.amount}
                          onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                          className="pl-8 font-mono"
                          step="0.01"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Available: {selectedCurrency?.symbol}{balances[transactionData.currency as keyof typeof balances].toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-medium">Recipient</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter recipient email or phone"
                        value={transactionData.recipient}
                        onChange={(e) => setTransactionData({...transactionData, recipient: e.target.value})}
                        className="font-sans"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowQRScanner(true)}
                        className="font-sans font-medium"
                      >
                        <Scan className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 font-sans font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Send Money"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateQRCode}
                      className="font-sans font-medium"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="withdraw" className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold font-sans mb-2">Withdraw to Bank</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Transfer money to your bank account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Currency</Label>
                      <Select 
                        value={transactionData.currency} 
                        onValueChange={(value) => setTransactionData({...transactionData, currency: value})}
                      >
                        <SelectTrigger className="font-sans">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code} className="font-sans">
                              {currency.symbol} {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-sans font-medium">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                          {selectedCurrency?.symbol}
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={transactionData.amount}
                          onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                          className="pl-8 font-mono"
                          step="0.01"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Available: {selectedCurrency?.symbol}{balances[transactionData.currency as keyof typeof balances].toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-medium">Bank Name</Label>
                    <Input
                      placeholder="Enter bank name"
                      value={transactionData.bankName}
                      onChange={(e) => setTransactionData({...transactionData, bankName: e.target.value})}
                      className="font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans font-medium">Account Number</Label>
                    <Input
                      placeholder="Enter account number"
                      value={transactionData.accountNumber}
                      onChange={(e) => setTransactionData({...transactionData, accountNumber: e.target.value})}
                      className="font-mono"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 font-sans font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Withdraw to Bank"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* QR Code Modal */}
        <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">QR Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-primary mx-auto mb-2" />
                    <div className="text-sm font-mono text-muted-foreground">
                      {qrCodeData.slice(0, 20)}...
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-sans">
                  Scan this QR code to complete the transaction
                </p>
              </div>
              <Button
                onClick={() => setShowQRCode(false)}
                className="w-full font-sans font-medium"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Scanner Modal */}
        <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">Scan QR Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <Scan className="h-16 w-16 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground font-sans">
                      Camera scanner would appear here
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-sans">
                  Point your camera at the QR code to scan recipient details
                </p>
              </div>
              <Button
                onClick={() => {
                  setTransactionData({...transactionData, recipient: "user@example.com"});
                  setShowQRScanner(false);
                  toast.success("QR code scanned successfully!");
                }}
                className="w-full font-sans font-medium"
              >
                Simulate Scan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}