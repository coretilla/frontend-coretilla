import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/layout/PageWrapper";
import { Info } from "lucide-react";

interface AuthenticationRequiredProps {
  authError?: string | null;
  onSignIn: () => void;
  isAuthenticating: boolean;
}

export function AuthenticationRequired({
  authError,
  onSignIn,
  isAuthenticating,
}: AuthenticationRequiredProps) {
  return (
    <PageWrapper
      title="Portfolio Dashboard"
      subtitle="Please sign in to view your portfolio"
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Authentication Required</CardTitle>
            <CardDescription className="font-sans">
              Please sign in with your wallet to view your portfolio dashboard.
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
              onClick={onSignIn}
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