"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Building2, Smartphone, QrCode, Info, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";

interface DepositFormData {
  currency: string;
  amount: string;
  paymentMethod: string;
}

export default function DepositPage() {
  const [formData, setFormData] = useState<DepositFormData>({
    currency: "",
    amount: "",
    paymentMethod: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "EUR", name: "Euro", symbol: "€" },
  ];

  const paymentMethods = [
    { id: "bank_transfer", name: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
    { id: "virtual_account", name: "Virtual Account", icon: CreditCard, description: "Virtual account number" },
    { id: "qris", name: "QRIS", icon: QrCode, description: "QR code payment" },
  ];

  const currentBalances = {
    USD: 1250.00,
    IDR: 18750000,
    EUR: 1100.50,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currency || !formData.amount || !formData.paymentMethod) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const handleConfirmDeposit = () => {
    setShowConfirmation(false);
    toast.success("Deposit request submitted successfully!");
    
    // Reset form
    setFormData({
      currency: "",
      amount: "",
      paymentMethod: "",
    });
  };

  const selectedCurrency = currencies.find(c => c.code === formData.currency);
  const selectedPaymentMethod = paymentMethods.find(p => p.id === formData.paymentMethod);

  return (
    <PageWrapper 
      title="Deposit Fiat"
      subtitle="Easily top up your balance to buy Bitcoin anytime."
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-2xl mx-auto">

        {/* Current Balances */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-sans">Current Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currencies.map((currency) => (
                <div key={currency.code} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary font-mono">
                    {currency.symbol}{currentBalances[currency.code as keyof typeof currentBalances].toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">{currency.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deposit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Make a Deposit</CardTitle>
            <CardDescription className="font-sans">
              Select your preferred currency and payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="font-sans font-medium">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData({...formData, currency: value})}
                >
                  <SelectTrigger className="font-sans">
                    <SelectValue placeholder="Select currency" />
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

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="font-sans font-medium">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                    {selectedCurrency?.symbol || "$"}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="pl-8 font-mono"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label className="font-sans font-medium">Payment Method</Label>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setFormData({...formData, paymentMethod: method.id})}
                      >
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium font-sans">{method.name}</div>
                          <div className="text-sm text-muted-foreground font-sans">{method.description}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.paymentMethod === method.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  Deposits are typically processed within 1-3 business days. You'll receive a confirmation email once your deposit is complete.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue to Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">Confirm Deposit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3 font-sans">Transaction Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Amount:</span>
                    <span className="font-mono font-semibold">
                      {selectedCurrency?.symbol}{formData.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Currency:</span>
                    <span className="font-sans">{selectedCurrency?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Payment Method:</span>
                    <span className="font-sans">{selectedPaymentMethod?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Processing Fee:</span>
                    <span className="font-mono">Free</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="font-sans">Total:</span>
                    <span className="font-mono">
                      {selectedCurrency?.symbol}{formData.amount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 font-sans font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDeposit}
                  className="flex-1 bg-primary hover:bg-primary/90 font-sans font-semibold"
                >
                  Confirm Deposit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}