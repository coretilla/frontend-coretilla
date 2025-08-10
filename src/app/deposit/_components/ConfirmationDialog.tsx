import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmationDialogProps } from "./types";

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  formData,
  isLoading,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) onOpenChange(open);
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
                <span className="text-muted-foreground font-sans">Amount:</span>
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
              onClick={() => onOpenChange(false)}
              className="flex-1 font-sans font-medium cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-primary hover:bg-primary/90 font-sans font-semibold cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Deposit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
