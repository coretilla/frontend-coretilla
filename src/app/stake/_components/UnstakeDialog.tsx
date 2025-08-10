"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

export default function UnstakeDialog({
  open,
  onOpenChange,
  canUnstake,
  cooldownPeriod,
  stakedAmount,
  formData,
  setFormData,
  onSubmit,
  disabled,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  canUnstake: boolean;
  cooldownPeriod: number;
  stakedAmount: string;
  formData: { unstakeAmount: string };
  setFormData: (d: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans font-bold">
            Unstake Bitcoin
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unstakeAmount" className="font-sans font-medium">
              Amount to Unstake
            </Label>
            <div className="relative">
              <Input
                id="unstakeAmount"
                type="number"
                placeholder="0.00000000"
                value={formData.unstakeAmount}
                onChange={(e) =>
                  setFormData({ ...formData, unstakeAmount: e.target.value })
                }
                className="font-mono"
                step="0.00000001"
                max={stakedAmount}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-sans"
                onClick={() =>
                  setFormData({ ...formData, unstakeAmount: stakedAmount })
                }
              >
                Max
              </Button>
            </div>
            <div className="text-sm text-muted-foreground font-sans">
              Staked: {parseFloat(stakedAmount).toFixed(1)} Bitcoin
            </div>
          </div>

          {!canUnstake && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription className="font-sans">
                You need to start cooldown before unstaking. This will start the{" "}
                {Math.floor(cooldownPeriod / 86400)} day cooldown period.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-sans font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 font-sans font-semibold cursor-pointer"
              disabled={disabled}
            >
              {canUnstake ? "Unstake" : "Start Cooldown"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
