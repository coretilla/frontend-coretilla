"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Info,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  History,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import {
  createDeposit,
  confirmDeposit,
  getUserData,
  parseUserBalance,
  UserBalance,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Badge } from "@/components/ui/badge";

interface DepositFormData {
  currency: string;
  amount: string;
  paymentMethod: string;
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

function DepositForm({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean;
  user: any;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState<DepositFormData>({
    currency: "",
    amount: "",
    paymentMethod: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const currencies = [{ code: "USD", name: "US Dollar", symbol: "$" }];
  const paymentMethods = [
    {
      id: "credit_card",
      name: "Credit Card",
      icon: CreditCard,
      description: "Pay with credit/debit card via Stripe",
    },
  ];

  useEffect(() => {
    if (paymentMethods.length === 1 && !formData.paymentMethod) {
      setFormData((p) => ({ ...p, paymentMethod: paymentMethods[0].id }));
    }
  }, [formData.paymentMethod]);
  useEffect(() => {
    if (currencies.length === 1 && !formData.currency) {
      setFormData((p) => ({ ...p, currency: currencies[0].code }));
    }
  }, [formData.currency]);

  const fetchUserBalance = async () => {
    if (!isAuthenticated) return;
    setIsLoadingBalance(true);
    try {
      const userData = await getUserData();
      const balances = parseUserBalance(userData);
      setCurrentBalances(balances);
    } catch (e) {
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchTransactions = async (page = 1, limit = 10) => {
    if (!isAuthenticated) return;
    setIsLoadingTransactions(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No access token found");

      const res = await fetch(
        `https://core-backend-production-0965.up.railway.app/users/me/transactions?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        if (res.status === 404) {
          setTransactions([]);
          setTransactionPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          });
          return;
        }
        throw new Error(`Failed to fetch transactions: ${res.status}`);
      }
      const text = await res.text();
      const data: TransactionResponse | Transaction[] = JSON.parse(text);
      if (Array.isArray(data)) {
        setTransactions(data);
        setTransactionPagination({
          page,
          limit,
          total: data.length,
          totalPages: Math.ceil(data.length / limit),
        });
      } else if (data.success && data.data) {
        setTransactions(data.data);
        setTransactionPagination(
          data.pagination ?? {
            page,
            limit,
            total: data.data.length,
            totalPages: Math.ceil(data.data.length / limit),
          }
        );
      } else {
        setTransactions([]);
        setTransactionPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      }
    } catch (e) {
      setTransactions([]);
      setTransactionPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBalance();
      fetchTransactions(1, 10);
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return toast.error("Please enter an amount");
    setShowConfirmation(true);
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatAmount = (amt: number, type: string) => {
    const f = Math.abs(amt).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return type === "DEPOSIT" ? `+$${f}` : `-$${f}`;
  };
  const formatTransactionDescription = (d: string) =>
    d.includes(" - pi_") ? d.split(" - pi_")[0] : d;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= transactionPagination.totalPages) {
      setTransactionPage(newPage);
      fetchTransactions(newPage, 10);
    }
  };

  return (
    <main>
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
              <RefreshCw
                className={`h-4 w-4 mr-1 ${
                  isLoadingBalance ? "animate-spin" : ""
                }`}
              />
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
            <div className="text-sm text-muted-foreground font-sans">
              US Dollar
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="deposit"
            className="font-sans flex items-center gap-2 cursor-pointer"
          >
            <CreditCard className="h-6 w-6" />
            Make Deposit
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="font-sans flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="h-6 w-6" />
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">Make a Deposit</CardTitle>
              <CardDescription className="font-sans">
                Select your preferred currency and payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!formData.amount)
                    return toast.error("Please enter an amount");
                  setShowConfirmation(true);
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label className="font-sans font-medium">Currency</Label>
                  <div className="flex items-center space-x-3 p-3 border border-primary bg-primary/5 rounded-lg">
                    <div className="text-primary font-mono font-bold">$</div>
                    <div className="flex-1">
                      <div className="font-medium font-sans">
                        US Dollar (USD)
                      </div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Only supported currency
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="font-sans font-medium">
                    Amount (USD)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="pl-8 font-mono"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">
                    Payment Method
                  </Label>
                  <div className="flex items-center space-x-3 p-4 border border-primary bg-primary/5 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium font-sans">Credit Card</div>
                      <div className="text-sm text-muted-foreground font-sans">
                        Pay with credit/debit card via Stripe
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans font-medium">Card Details</Label>
                  <div className="border rounded-lg p-4">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            fontFamily:
                              '"Helvetica Neue", Helvetica, sans-serif',
                            "::placeholder": { color: "#aab7c4" },
                          },
                          invalid: { color: "#fa755a" },
                        },
                      }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground font-sans">
                    Test card: 4242 4242 4242 4242 (any future date, any CVC)
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="font-sans">
                    Deposits will be processed quickly. You'll receive a
                    confirmation once complete.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-sans font-semibold cursor-pointer"
                  disabled={isLoading || !stripe || !elements}
                >
                  {isLoading
                    ? "Processing..."
                    : !stripe || !elements
                    ? "Loading Payment Form..."
                    : "Continue to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Dialog
            open={showConfirmation}
            onOpenChange={(o) => {
              if (!isLoading) setShowConfirmation(o);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold">
                  Confirm Deposit
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-3 font-sans">
                    Transaction Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Amount:
                      </span>
                      <span className="font-mono font-semibold">
                        ${formData.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Currency:
                      </span>
                      <span className="font-sans">US Dollar (USD)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Payment Method:
                      </span>
                      <span className="font-sans">Credit Card</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">
                        Processing Fee:
                      </span>
                      <span className="font-mono">Free</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span className="font-sans">Total:</span>
                      <span className="font-mono">${formData.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 font-sans font-medium cursor-pointer"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await (async () => {
                        setIsLoading(true);
                        try {
                          const token = localStorage.getItem("jwt_token");
                          if (!token) throw new Error("No access token found");
                          const userCheckResponse = await fetch(
                            "https://core-backend-production-0965.up.railway.app/users/me",
                            {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          if (!userCheckResponse.ok) {
                            const txt = await userCheckResponse.text();
                            if (userCheckResponse.status === 404)
                              throw new Error(
                                "User not found in system. Please contact support."
                              );
                            if (userCheckResponse.status === 401)
                              throw new Error(
                                "Authentication expired. Please sign in again."
                              );
                            throw new Error(`User verification failed: ${txt}`);
                          }

                          const depositData = await createDeposit({
                            amount: parseFloat(formData.amount),
                            currency: formData.currency.toLowerCase(),
                            description: "Credit card deposit",
                          });

                          const card = elements!.getElement(CardElement);
                          if (!card) throw new Error("Card element not ready");

                          const { error, paymentIntent } =
                            await stripe!.confirmCardPayment(
                              depositData.client_secret,
                              {
                                payment_method: {
                                  card,
                                  billing_details: {
                                    name: user?.name ?? "User",
                                  },
                                },
                              }
                            );
                          if (error)
                            throw new Error(error.message || "Payment failed");
                          if (
                            !paymentIntent ||
                            paymentIntent.status !== "succeeded"
                          )
                            throw new Error(
                              `Payment failed. Status: ${paymentIntent?.status}`
                            );

                          await new Promise((r) => setTimeout(r, 1000));

                          const result = await confirmDeposit({
                            payment_intent_id: paymentIntent.id,
                            payment_method_id:
                              paymentIntent.payment_method as string,
                          });

                          toast.success(
                            `Deposit successful! New balance: $${result.new_balance}`
                          );
                          setFormData({
                            amount: "",
                            currency: "USD",
                            paymentMethod: "credit_card",
                          });
                          setShowConfirmation(false);
                        } catch (e: any) {
                          toast.error(
                            `Deposit failed: ${e?.message ?? "Unknown error"}`
                          );
                        } finally {
                          setIsLoading(false);
                        }
                      })();
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 font-sans font-semibold cursor-pointer"
                    disabled={isLoading || !stripe || !elements}
                  >
                    {isLoading ? "Processing..." : "Confirm Deposit"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

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
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${
                      isLoadingTransactions ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
              {transactionPagination.total > 0 && (
                <CardDescription className="font-sans">
                  Showing {transactions.length} of {transactionPagination.total}{" "}
                  transactions
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                    >
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
                  <h3 className="text-lg font-semibold font-sans mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-muted-foreground font-sans">
                    Your transaction history will appear here once you make your
                    first deposit or withdrawal.
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
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "DEPOSIT"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "DEPOSIT" ? (
                            <ArrowDownLeft className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium font-sans">
                            {formatTransactionDescription(
                              transaction.description
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground font-sans">
                            {formatDate(transaction.createdAt)} • ID:{" "}
                            {transaction.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold font-mono ${
                            transaction.type === "DEPOSIT"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatAmount(transaction.amount, transaction.type)}
                        </div>
                        <Badge
                          variant={
                            transaction.type === "DEPOSIT"
                              ? "default"
                              : "secondary"
                          }
                          className="font-sans text-xs"
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}

                  {transactionPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <div className="text-sm text-muted-foreground font-sans">
                        Page {transactionPagination.page} of{" "}
                        {transactionPagination.totalPages}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(transactionPagination.page - 1)
                          }
                          disabled={
                            transactionPagination.page <= 1 ||
                            isLoadingTransactions
                          }
                          className="font-sans"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(transactionPagination.page + 1)
                          }
                          disabled={
                            transactionPagination.page >=
                              transactionPagination.totalPages ||
                            isLoadingTransactions
                          }
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
    </main>
  );
}

export default function DepositPage() {
  const { isConnected } = useWallet();
  const {
    isAuthenticated,
    isAuthenticating,
    signIn,
    user,
    error: authError,
  } = useAuth();

  const elementsOptions = useMemo(
    () => ({
      appearance: { theme: "stripe" as const },
    }),
    []
  );

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
              <CardTitle className="font-sans">
                Connect Wallet Required
              </CardTitle>
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
              <CardTitle className="font-sans">
                Authentication Required
              </CardTitle>
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
                  You'll be asked to sign a message with your wallet to
                  authenticate.
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
        <Elements stripe={stripePromise} options={elementsOptions}>
          <DepositForm isAuthenticated={isAuthenticated} user={user} />
        </Elements>
      </div>
    </PageWrapper>
  );
}
