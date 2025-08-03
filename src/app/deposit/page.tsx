"use client";

import { useState, useEffect } from "react";
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
import { loadStripe, Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js";
import { stripePromise } from "@/lib/stripe";
import { createDeposit, confirmDeposit } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { testAccessToken, analyzeAccessToken } from "@/lib/auth";

interface DepositFormData {
  currency: string;
  amount: string;
  paymentMethod: string;
}

interface StripeCardData {
  cardElement: StripeCardElement | null;
  stripe: Stripe | null;
  elements: StripeElements | null;
}

export default function DepositPage() {
  const { isConnected, address } = useWallet();
  const { isAuthenticated, isAuthenticating, signIn, user, signature, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<DepositFormData>({
    currency: "",
    amount: "",
    paymentMethod: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [stripeData, setStripeData] = useState<StripeCardData>({
    cardElement: null,
    stripe: null,
    elements: null,
  });
  const [showCreditCard, setShowCreditCard] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "EUR", name: "Euro", symbol: "€" },
  ];

  const paymentMethods = [
    { id: "credit_card", name: "Credit Card", icon: CreditCard, description: "Pay with credit/debit card via Stripe" },
    { id: "bank_transfer", name: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
    { id: "virtual_account", name: "Virtual Account", icon: CreditCard, description: "Virtual account number" },
    { id: "qris", name: "QRIS", icon: QrCode, description: "QR code payment" },
  ];

  const currentBalances = {
    USD: 0.00,
    IDR: 0,
    EUR: 0.00,
  };

  useEffect(() => {
    const initializeStripe = async () => {
      const stripe = await stripePromise;
      if (stripe) {
        const elements = stripe.elements();
        const cardElement = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
          },
        });
        
        setStripeData({ stripe, elements, cardElement });
        
        // Mount card element when credit card is selected
        if (formData.paymentMethod === 'credit_card' && showCreditCard) {
          setTimeout(() => {
            cardElement.mount('#card-element');
          }, 100);
        }
      }
    };

    initializeStripe();
  }, [formData.paymentMethod, showCreditCard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currency || !formData.amount || !formData.paymentMethod) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.paymentMethod === 'credit_card') {
      await handleStripePayment();
    } else {
      setIsLoading(true);
      // Simulate API call for other payment methods
      setTimeout(() => {
        setIsLoading(false);
        setShowConfirmation(true);
      }, 2000);
    }
  };

  const handleStripePayment = async () => {
    if (!stripeData.stripe || !stripeData.cardElement) {
      toast.error("Stripe not initialized");
      return;
    }

    // Debug: Check authentication state before API call
    console.log('🔍 Authentication state before deposit:');
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- user:', user);
    console.log('- JWT token exists:', !!localStorage.getItem('jwt_token'));

    setIsLoading(true);

    try {
      // Step 0: First check if user exists with /users/me
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('No access token found');
      }

      console.log('👤 Checking user exists with /users/me...');
      const userCheckResponse = await fetch('https://core-backend-production-0965.up.railway.app/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('👤 /users/me response status:', userCheckResponse.status);

      if (!userCheckResponse.ok) {
        const errorText = await userCheckResponse.text();
        console.error('❌ User check failed:', errorText);
        
        if (userCheckResponse.status === 404) {
          throw new Error('User not found in system. Please contact support to register your account.');
        } else if (userCheckResponse.status === 401) {
          throw new Error('Authentication expired. Please sign in again.');
        } else {
          throw new Error(`User verification failed: ${errorText}`);
        }
      }

      const userData = await userCheckResponse.json();
      console.log('✅ User verified:', userData);

      // Step 1: Create deposit on backend with JWT Bearer token auth
      const depositData = await createDeposit({
        amount: parseFloat(formData.amount),
        currency: formData.currency.toLowerCase(),
        description: "Credit card deposit",
      });

      console.log('✅ Deposit created:', depositData);

      // Step 2: Process payment with Stripe
      const { error, paymentIntent } = await stripeData.stripe.confirmCardPayment(
        depositData.client_secret,
        {
          payment_method: {
            card: stripeData.cardElement,
            billing_details: { name: 'User Name' },
          },
        },
      );

      if (error) {
        throw new Error(`Payment failed: ${error.message}`);
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Payment failed. Status: ${paymentIntent.status}`);
      }

      console.log('✅ Payment confirmed:', paymentIntent);

      // Step 3: Wait for processing (important!)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 4: Confirm deposit on backend with JWT Bearer token auth
      const result = await confirmDeposit({
        payment_intent_id: paymentIntent.id,
        payment_method_id: paymentIntent.payment_method as string,
      });

      console.log('✅ Deposit confirmed:', result);
      
      setIsLoading(false);
      toast.success(`Deposit successful! New balance: $${result.new_balance}`);
      
      // Reset form
      setFormData({
        currency: "",
        amount: "",
        paymentMethod: "",
      });
      setShowCreditCard(false);
      
    } catch (error) {
      console.error('❌ Deposit failed:', error);
      setIsLoading(false);
      toast.error(`Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

  // Show authentication prompt if not connected or authenticated
  if (!isConnected) {
    return (
      <PageWrapper 
        title="Deposit Fiat"
        subtitle="Connect your wallet to start depositing."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Connect Wallet Required</CardTitle>
              <CardDescription className="font-sans">
                Please connect your wallet to access deposit functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You need to connect your wallet first to deposit funds.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper 
        title="Deposit Fiat"
        subtitle="Sign in with your wallet to start depositing."
        className="bg-gradient-to-br from-orange-50 to-orange-100"
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Authentication Required</CardTitle>
              <CardDescription className="font-sans">
                Please sign in with your wallet to access deposit functionality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="font-sans text-red-600">
                    {authError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={signIn}
                disabled={isAuthenticating}
                className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
              >
                {isAuthenticating ? "Signing in..." : "Sign in with Wallet"}
              </Button>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  You'll be asked to sign a message with your wallet to authenticate.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Deposit Fiat"
      subtitle="Easily top up your balance to buy Bitcoin anytime."
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-2xl mx-auto">

        {/* Authentication Debug Info */}
        {user && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="font-sans text-green-800">✅ Authenticated with JWT</CardTitle>
              <CardDescription className="font-sans text-green-600">
                Wallet: {user.wallet_address || address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-700 font-sans mb-3">
                🔑 Deposit API calls use access_token as Bearer token in Authorization header
              </div>
              <div className="text-xs text-green-600 font-mono mb-3">
                Access Token: {localStorage.getItem('jwt_token') ? `${localStorage.getItem('jwt_token')!.substring(0, 40)}...` : 'None'}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => {
                    const token = localStorage.getItem('jwt_token');
                    console.log('🔍 Manual access_token check:');
                    console.log('- Access token (stored as jwt_token):', token ? `${token.substring(0, 50)}...` : 'None');
                    console.log('- isAuthenticated state:', isAuthenticated);
                    console.log('- user state:', user);
                  }}
                  variant="outline"
                  size="sm"
                  className="font-sans"
                >
                  🔍 Check
                </Button>
                <Button 
                  onClick={testAccessToken}
                  variant="outline"
                  size="sm"
                  className="font-sans"
                >
                  🧪 Test
                </Button>
                <Button 
                  onClick={analyzeAccessToken}
                  variant="outline"
                  size="sm"
                  className="font-sans"
                >
                  🔬 Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                        onClick={() => {
                          setFormData({...formData, paymentMethod: method.id});
                          setShowCreditCard(method.id === 'credit_card');
                        }}
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

              {/* Credit Card Input */}
              {showCreditCard && formData.paymentMethod === 'credit_card' && (
                <div className="space-y-2">
                  <Label className="font-sans font-medium">Card Details</Label>
                  <div className="border rounded-lg p-4">
                    <div id="card-element" className="min-h-[40px]">
                      {/* Stripe Elements will mount here */}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Test card: 4242 4242 4242 4242 (any future date, any CVC)
                  </div>
                </div>
              )}

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