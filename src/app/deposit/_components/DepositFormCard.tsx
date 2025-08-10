import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Info } from "lucide-react";
import { toast } from "sonner";
import { DepositFormCardProps } from "./types";

export function DepositFormCard({
  formData,
  onFormDataChange,
  isLoading,
  onSubmit,
}: DepositFormCardProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return toast.error("Please enter an amount");
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Make a Deposit</CardTitle>
        <CardDescription className="font-sans">
          Select your preferred currency and payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-sans font-medium">Currency</Label>
            <div className="flex items-center space-x-3 p-3 border border-primary bg-primary/5 rounded-lg">
              <div className="text-primary font-mono font-bold">$</div>
              <div className="flex-1">
                <div className="font-medium font-sans">US Dollar (USD)</div>
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
                  onFormDataChange({ ...formData, amount: e.target.value })
                }
                className="pl-8 font-mono"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-sans font-medium">Payment Method</Label>
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
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
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
              Deposits will be processed quickly. You'll receive a confirmation
              once complete.
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
  );
}
