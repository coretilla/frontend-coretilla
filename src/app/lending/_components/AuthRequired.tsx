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
import { Shield } from "lucide-react";
import { AuthRequiredProps } from "./types";

export function AuthRequired({
  authError,
  onSignIn,
  isAuthenticating,
}: AuthRequiredProps) {
  return (
    <PageWrapper
      title="Lending & Borrowing"
      subtitle="Sign in with your wallet to start lending and borrowing."
      className="bg-gradient-to-br from-orange-50 to-orange-100"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Authentication Required</CardTitle>
            <CardDescription className="font-sans">
              Please sign in with your wallet to access lending and borrowing
              functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <Alert>
                <Shield className="h-4 w-4" />
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
              <Shield className="h-4 w-4" />
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
