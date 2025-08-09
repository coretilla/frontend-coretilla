"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Info, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { loadStripe, Stripe, StripeElements, StripeCardElement } from "@stripe/stripe-js";
import { stripePromise } from "@/lib/stripe";
import { createDeposit, confirmDeposit, getUserData, parseUserBalance, UserBalance } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, History, DollarSign, BarChart3 } from "lucide-react";

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

interface Transaction {
  id: number;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  description: string;
  createdAt: string;
}

interface TransactionResponse {
  success?: boolean;
  data?: Transaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  const [stripeInitialized, setStripeInitialized] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [currentBalances, setCurrentBalances] = useState<UserBalance>({
    USD: 0,
  });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPagination, setTransactionPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
  ];

  const paymentMethods = [
    { id: "credit_card", name: "Credit Card", icon: CreditCard, description: "Pay with credit/debit card via Stripe" },
  ];

  const fetchUserBalance = async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingBalance(true);
    try {
      console.log('💰 Fetching user balance...');
      const userData = await getUserData();
      const balances = parseUserBalance(userData);
      setCurrentBalances(balances);
      console.log('✅ Balance updated:', balances);
    } catch (error) {
      console.error('❌ Failed to fetch balance:', error);
      // Don't show error toast for balance, just keep existing values
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchTransactions = async (page: number = 1, limit: number = 10) => {
    if (!isAuthenticated) return;
    
    setIsLoadingTransactions(true);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('No access token found');
      }

      console.log(`Fetching transactions - page: ${page}, limit: ${limit}`);
      
      const response = await fetch(`https://core-backend-production-0965.up.railway.app/users/me/transactions?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No transactions or endpoint not available
          setTransactions([]);
          setTransactionPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          });
          return;
        }
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const responseText = await response.text();
      const data: TransactionResponse = JSON.parse(responseText);
      
      if (data.success && data.data) {
        setTransactions(data.data);
        // Handle pagination if provided, otherwise calculate from data
        if (data.pagination) {
          setTransactionPagination(data.pagination);
        } else {
          setTransactionPagination({
            page: page,
            limit: limit,
            total: data.data.length,
            totalPages: Math.ceil(data.data.length / limit),
          });
        }
        console.log('✅ Transactions loaded:', data.data);
      } else if (Array.isArray(data)) {
        const transactionsArray = data as Transaction[];
        setTransactions(transactionsArray);
        setTransactionPagination({
          page: page,
          limit: limit,
          total: transactionsArray.length,
          totalPages: Math.ceil(transactionsArray.length / limit),
        });
      } else {
        setTransactions([]);
        setTransactionPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      }

    } catch (error) {
      console.error('❌ Failed to fetch transactions:', error);
      setTransactions([]);
      setTransactionPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log('🔄 Initializing Stripe...');
        setStripeError(null);
        
        const stripe = await stripePromise;
        
        if (!stripe) {
          const error = 'Stripe failed to load. Please check your internet connection.';
          console.error('❌', error);
          setStripeError(error);
          return;
        }
        
        console.log('✅ Stripe loaded successfully');
        const elements = stripe.elements();
        const cardElement = elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
        });
        
        setStripeData({ stripe, elements, cardElement });
        
        // Multiple attempts to mount card element
        let retryCount = 0;
        const maxRetries = 5;
        
        const tryMount = () => {
          // Try both ref and getElementById
          const cardElementContainer = cardElementRef.current || document.getElementById('card-element');
          console.log('🔍 Card element container found:', !!cardElementContainer);
          console.log('🔍 Container has children:', cardElementContainer?.hasChildNodes());
          console.log('🔍 Ref current:', !!cardElementRef.current);
          
          if (cardElementContainer && !cardElementContainer.hasChildNodes()) {
            console.log(`🔄 Mounting Stripe card element (attempt ${retryCount + 1})...`);
            try {
              cardElement.mount(cardElementContainer);
              console.log('✅ Stripe card element mounted successfully');
              setStripeInitialized(true);
              
              // Add event listeners to verify mount
              cardElement.on('ready', () => {
                console.log('✅ Stripe card element is ready');
                setStripeInitialized(true);
              });
              
              cardElement.on('change', (event) => {
                if (event.error) {
                  console.log('⚠️ Stripe card element error:', event.error.message);
                } else {
                  console.log('✅ Stripe card element change event');
                }
              });
              
            } catch (error: any) {
              console.error('❌ Error mounting Stripe card element:', error);
              setStripeError(`Failed to mount payment form: ${error.message}`);
              
              // Retry if not max attempts
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(tryMount, 500);
              }
            }
          } else if (!cardElementContainer) {
            console.log(`🔍 Card element container not found (attempt ${retryCount + 1})`);
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(tryMount, 200);
            } else {
              const error = 'Payment form container not found after multiple attempts';
              console.error('❌', error);
              setStripeError(error);
            }
          } else if (cardElementContainer?.hasChildNodes()) {
            console.log('✅ Card element already has children, assuming mounted');
            setStripeInitialized(true);
          }
        };
        
        // Check if element is already available
        if (cardElementRef.current) {
          console.log('🔍 Card element ref already available');
          setTimeout(tryMount, 100);
        } else {
          // Use MutationObserver to watch for when the element appears
          const observer = new MutationObserver((mutations) => {
            if (cardElementRef.current || document.getElementById('card-element')) {
              console.log('🔍 Card element found via observer');
              observer.disconnect();
              setTimeout(tryMount, 100);
            }
          });
          
          // Start observing
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          // Fallback: try immediately and then cleanup observer after 10 seconds
          setTimeout(() => {
            tryMount();
            setTimeout(() => {
              observer.disconnect();
            }, 10000);
          }, 300);
        }
        
      } catch (error) {
        const errorMessage = `Error initializing Stripe: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error('❌', errorMessage);
        setStripeError(errorMessage);
      }
    };

    // Only initialize if on deposit tab and authenticated
    console.log('🔍 useEffect dependency check:', { activeTab, isAuthenticated });
    if (activeTab === 'deposit' && isAuthenticated) {
      console.log('🔄 Starting Stripe initialization...');
      // Add delay to ensure DOM is fully rendered
      setTimeout(() => {
        initializeStripe();
      }, 500);
    } else {
      console.log('⏸️ Skipping Stripe initialization - conditions not met');
    }
  }, [activeTab, isAuthenticated]);

  // Fetch balance and transactions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBalance();
      fetchTransactions(1, 10);
    }
  }, [isAuthenticated]);

  // Auto-select credit card and USD since they're the only options
  useEffect(() => {
    if (paymentMethods.length === 1 && !formData.paymentMethod) {
      setFormData(prev => ({
        ...prev,
        paymentMethod: paymentMethods[0].id
      }));
    }
  }, [formData.paymentMethod]);

  // Auto-select USD currency since it's the only option
  useEffect(() => {
    if (currencies.length === 1 && !formData.currency) {
      setFormData(prev => ({
        ...prev,
        currency: currencies[0].code
      }));
    }
  }, [formData.currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error("Please enter an amount");
      return;
    }

    // Show confirmation modal instead of processing immediately
    setShowConfirmation(true);
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
      
      // Refresh user balance and transactions
      fetchUserBalance();
      fetchTransactions(1, 10);
      
      // Reset form
      setFormData({
        amount: "",
        currency: "USD",
        paymentMethod: "credit_card",
      });
      
    } catch (error) {
      console.error('❌ Deposit failed:', error);
      setIsLoading(false);
      toast.error(`Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleConfirmDeposit = async () => {
    setShowConfirmation(false);
    await handleStripePayment();
  };

  const selectedCurrency = currencies[0]; // Always USD since it's the only option
  const selectedPaymentMethod = paymentMethods[0]; // Always credit card since it's the only option

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return type === 'DEPOSIT' ? `+$${formatted}` : `-$${formatted}`;
  };

  const formatTransactionDescription = (description: string) => {
    // Remove Stripe payment intent ID from description
    // Example: "Deposit via Stripe - pi_3Rs2FPRpP4URq09n08Elckqa" -> "Deposit via Stripe"
    if (description.includes(' - pi_')) {
      return description.split(' - pi_')[0];
    }
    return description;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= transactionPagination.totalPages) {
      setTransactionPage(newPage);
      fetchTransactions(newPage, 10);
    }
  };

  const handleTabChange = (value: string) => {
    console.log('🔄 Tab changed to:', value);
    setActiveTab(value);
    if (value === "transactions" && transactions.length === 0) {
      fetchTransactions(1, 10);
    }
    // Reset Stripe state when switching to deposit tab
    if (value === "deposit" && !stripeInitialized) {
      setStripeError(null);
      setStripeInitialized(false);
    }
  };

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
            <CardContent className="text-center">
              <ConnectWallet 
                variant="default" 
                size="lg" 
                className="w-full max-w-sm mx-auto" 
              />
              <Alert className="mt-4">
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


        {/* Current Balance */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-sans">Current Balance</CardTitle>
              <Button
                onClick={fetchUserBalance}
                disabled={isLoadingBalance}
                variant="outline"
                size="sm"
                className="font-sans"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-muted rounded-lg relative">
              {isLoadingBalance && (
                <div className="absolute inset-0 bg-muted/50 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
              <div className="text-3xl font-bold text-primary font-mono">
                ${(currentBalances.USD || 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-sans">US Dollar</div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Deposit and Transactions */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit" className="font-sans flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Make Deposit
            </TabsTrigger>
            <TabsTrigger value="transactions" className="font-sans flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="mt-6">
            <Card>
          <CardHeader>
            <CardTitle className="font-sans">Make a Deposit</CardTitle>
            <CardDescription className="font-sans">
              Select your preferred currency and payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Currency - Auto Selected */}
              <div className="space-y-2">
                <Label className="font-sans font-medium">Currency</Label>
                <div className="flex items-center space-x-3 p-3 border border-primary bg-primary/5 rounded-lg">
                  <div className="text-primary font-mono font-bold">$</div>
                  <div className="flex-1">
                    <div className="font-medium font-sans">US Dollar (USD)</div>
                    <div className="text-sm text-muted-foreground font-sans">Only supported currency</div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="font-sans font-medium">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono">
                    $
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

              {/* Payment Method - Auto Selected */}
              <div className="space-y-2">
                <Label className="font-sans font-medium">Payment Method</Label>
                <div className="flex items-center space-x-3 p-4 border border-primary bg-primary/5 rounded-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium font-sans">Credit Card</div>
                    <div className="text-sm text-muted-foreground font-sans">Pay with credit/debit card via Stripe</div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
                </div>
              </div>

              {/* Credit Card Input */}
              <div className="space-y-2">
                <Label className="font-sans font-medium">Card Details</Label>
                <div className="border rounded-lg p-4">
                  <div ref={cardElementRef} id="card-element" className="min-h-[40px]">
                    {/* Stripe Elements will mount here */}
                    {!stripeInitialized && !stripeError && (
                      <div className="flex items-center justify-center text-muted-foreground">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading payment form...
                      </div>
                    )}
                    {stripeError && (
                      <div className="flex items-center justify-center text-red-500 text-sm">
                        <Info className="h-4 w-4 mr-2" />
                        {stripeError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground font-sans">
                  Test card: 4242 4242 4242 4242 (any future date, any CVC)
                </div>
                {(stripeError || !stripeInitialized) && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🔄 Manual retry Stripe initialization...');
                        setStripeError(null);
                        setStripeInitialized(false);
                        // Force re-trigger useEffect
                        setActiveTab('transactions');
                        setTimeout(() => setActiveTab('deposit'), 100);
                      }}
                      className="text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                    {stripeError && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="text-xs"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reload Page
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Info Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="font-sans">
                  Deposits will be processed quickly and efficiently. You'll receive a confirmation once your deposit is complete.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold"
                disabled={isLoading || !stripeInitialized || !!stripeError}
              >
                {isLoading ? "Processing..." : 
                 !stripeInitialized ? "Loading Payment Form..." :
                 stripeError ? "Payment Form Error" :
                 "Continue to Payment"}
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
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm Deposit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-sans flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Transaction History
                  </CardTitle>
                  <Button
                    onClick={() => fetchTransactions(transactionPage, 10)}
                    disabled={isLoadingTransactions}
                    variant="outline"
                    size="sm"
                    className="font-sans"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoadingTransactions ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                {transactionPagination.total > 0 && (
                  <CardDescription className="font-sans">
                    Showing {transactions.length} of {transactionPagination.total} transactions
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-muted rounded-full"></div>
                          <div className="space-y-2">
                            <div className="w-32 h-4 bg-muted rounded"></div>
                            <div className="w-24 h-3 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="w-20 h-6 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4 flex justify-center">
                      <CreditCard className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold font-sans mb-2">No transactions yet</h3>
                    <p className="text-muted-foreground font-sans">
                      Your transaction history will appear here once you make your first deposit or withdrawal.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'DEPOSIT' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'DEPOSIT' ? (
                              <ArrowDownLeft className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium font-sans">
                              {formatTransactionDescription(transaction.description)}
                            </div>
                            <div className="text-sm text-muted-foreground font-sans">
                              {formatDate(transaction.createdAt)} • ID: {transaction.id}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold font-mono ${
                            transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatAmount(transaction.amount, transaction.type)}
                          </div>
                          <Badge 
                            variant={transaction.type === 'DEPOSIT' ? 'default' : 'secondary'}
                            className="font-sans text-xs"
                          >
                            {transaction.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}

                    {/* Pagination */}
                    {transactionPagination.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="text-sm text-muted-foreground font-sans">
                          Page {transactionPagination.page} of {transactionPagination.totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(transactionPagination.page - 1)}
                            disabled={transactionPagination.page <= 1 || isLoadingTransactions}
                            className="font-sans"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(transactionPagination.page + 1)}
                            disabled={transactionPagination.page >= transactionPagination.totalPages || isLoadingTransactions}
                            className="font-sans"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}