"use client";
import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
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
} from "@/app/api/api";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import {
  DepositFormData,
  Transaction,
  TransactionResponse,
} from "../../types/deposit-types";
import { UserBalance } from "../../types/api-types";
import { CurrentBalance, DepositFormCard, ConfirmationDialog, TransactionHistory , WalletNotConnected, AuthRequired } from "../_components";

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= transactionPagination.totalPages) {
      setTransactionPage(newPage);
      fetchTransactions(newPage, 10);
    }
  };

  return (
    <main>
      <CurrentBalance
        balance={currentBalances}
        isLoading={isLoadingBalance}
        onRefresh={fetchUserBalance}
      />

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
          <DepositFormCard
            formData={formData}
            onFormDataChange={setFormData}
            isLoading={isLoading}
            onSubmit={() => setShowConfirmation(true)}
          />

          <ConfirmationDialog
            isOpen={showConfirmation}
            onOpenChange={setShowConfirmation}
            formData={formData}
            isLoading={isLoading}
            onConfirm={async () => {
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
                  await stripe!.confirmCardPayment(depositData.client_secret, {
                    payment_method: {
                      card,
                      billing_details: {
                        name: user?.name ?? "User",
                      },
                    },
                  });
                if (error) throw new Error(error.message || "Payment failed");
                if (!paymentIntent || paymentIntent.status !== "succeeded")
                  throw new Error(
                    `Payment failed. Status: ${paymentIntent?.status}`
                  );

                await new Promise((r) => setTimeout(r, 1000));

                const result = await confirmDeposit({
                  payment_intent_id: paymentIntent.id,
                  payment_method_id: paymentIntent.payment_method as string,
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
                toast.error(`Deposit failed: ${e?.message ?? "Unknown error"}`);
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionHistory
            transactions={transactions}
            isLoading={isLoadingTransactions}
            onRefresh={() => fetchTransactions(transactionPage, 10)}
            pagination={transactionPagination}
            onPageChange={handlePageChange}
          />
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
    return <WalletNotConnected />;
  }

  if (!isAuthenticated) {
    return (
      <AuthRequired
        authError={authError}
        onSignIn={signIn}
        isAuthenticating={isAuthenticating}
      />
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
