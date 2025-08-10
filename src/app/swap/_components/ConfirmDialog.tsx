"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Props } from "./types";

export default function ConfirmDialog({
  open,
  onOpenChange,
  symbol,
  amount,
  btcAmount,
  networkFee,
  estimatedTime,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans font-bold">
            Confirm Swap
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-3 font-sans">
              Transaction Summary
            </h3>
            <div className="space-y-2">
              <Row label="From:" value={`${symbol}${amount} USD`} />
              <Row label="To:" value={`${btcAmount} BTC`} />
              <Row label="Network:" value="Core Network" />
              <Row label="Network Fee:" value={`${networkFee} BTC`} />
              <Row label="Estimated Time:" value={estimatedTime} />
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span className="font-sans">You'll Receive:</span>
                <span className="font-mono text-primary">
                  {(parseFloat(btcAmount || "0") - networkFee).toFixed(8)} BTC
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-sans font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-primary hover:bg-primary/90 font-sans font-semibold cursor-pointer"
            >
              Confirm Swap
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground font-sans">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
