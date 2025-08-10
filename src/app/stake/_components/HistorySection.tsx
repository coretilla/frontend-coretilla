"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronRight, Info } from "lucide-react";
import Image from "next/image";

export default function HistorySection({
  history,
  isLoading,
  error,
  onSignIn,
  isAuthenticating,
}: {
  history: any[];
  isLoading: boolean;
  error?: string | null;
  onSignIn: () => void;
  isAuthenticating: boolean;
}) {
  if (isLoading)
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground font-sans text-sm mt-2">
          Loading history...
        </p>
      </div>
    );

  if (error)
    return (
      <Alert
        variant={
          error.includes("Backend configuration") ? "destructive" : "default"
        }
      >
        <Info className="h-4 w-4" />
        <AlertDescription className="font-sans">
          {error}
          {error.includes("Authentication") && (
            <div className="mt-2">
              <Button
                onClick={onSignIn}
                size="sm"
                variant="outline"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? "Signing in..." : "Sign In to View History"}
              </Button>
            </div>
          )}
          {error.includes("Backend configuration") && (
            <div className="mt-2 text-sm">
              <p>
                This is a backend configuration issue. The staking vault address
                needs to be configured:
              </p>
              <code className="block mt-1 p-2 bg-muted rounded text-xs">
                StakingVault: 0x3EF7d600DB474F1a544602Bd7dA33c53d98B7B1b
              </code>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );

  if (history.length === 0)
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground font-sans">
          No staking history found
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      {history.map((item, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium font-sans">Stake Bitcoin</div>
                <div className="text-sm text-muted-foreground font-mono">
                  Block: {item.blockNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold font-mono flex items-center justify-center">
                  {parseFloat(item.amount).toFixed(1)} BTC
                  <Image
                    src="/image/btcLogo.png"
                    alt="Bitcoin"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <a
                  href={`https://scan.coredao.org/tx/${item.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-mono flex items-center gap-1"
                >
                  View your transaction hash{" "}
                  <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
