"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStaking } from "@/hooks/useStaking";
import { useStakingHistory } from "@/hooks/useStakingHistory";
import { useYearlyRewards } from "@/hooks/useYearlyRewards";
import type { StakeFormData } from "@/app/types/staking-types";

export function useStakeUi() {
  const [formData, setFormData] = useState<StakeFormData>({
    mBtcAmount: "",
    unstakeAmount: "",
  });
  const [activeTab, setActiveTab] = useState("staking");
  const [showUnstakeDialog, setShowUnstakeDialog] = useState(false);
  const [pendingStakeAmount, setPendingStakeAmount] = useState<string | null>(
    null
  );
  const [processedHash, setProcessedHash] = useState<string | null>(null);

  const staking = useStaking();
  const {
    history,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useStakingHistory();
  const { yearlyRewards } = useYearlyRewards(formData.mBtcAmount);

  // auto-stake after approval
  useEffect(() => {
    const run = async () => {
      if (
        staking.isConfirmed &&
        pendingStakeAmount &&
        staking.hash &&
        staking.hash !== processedHash
      ) {
        try {
          await new Promise((r) => setTimeout(r, 1000));
          toast.success("Approval confirmed! Now staking...");
          await staking.stake(pendingStakeAmount);
          setPendingStakeAmount(null);
          setProcessedHash(staking.hash);
        } catch (e) {
          toast.error("Failed to stake after approval");
          setPendingStakeAmount(null);
          setProcessedHash(staking.hash);
        }
      }
    };
    run();
  }, [staking.isConfirmed, pendingStakeAmount, staking.hash, processedHash]);

  useEffect(() => {
    if (
      staking.isConfirmed &&
      staking.hash &&
      staking.hash !== processedHash &&
      !pendingStakeAmount
    ) {
      staking.refetchAll();
      refetchHistory();
      setFormData({ mBtcAmount: "", unstakeAmount: "" });
      toast.success("Transaction confirmed successfully!");
      setProcessedHash(staking.hash);
    }
  }, [staking.isConfirmed, staking.hash, processedHash, pendingStakeAmount]);

  async function handleStakeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(formData.mBtcAmount || "0");
    if (!amt || amt <= 0)
      return toast.error("Please enter a valid Bitcoin amount");
    if (amt > parseFloat(staking.mBTCBalance))
      return toast.error("Insufficient Bitcoin balance");

    try {
      if (staking.needsApproval(formData.mBtcAmount)) {
        toast.info("Step 1/2: Approving Bitcoin for staking...");
        setPendingStakeAmount(formData.mBtcAmount);
        await staking.approve(formData.mBtcAmount);
        return;
      }
      toast.info("Staking Bitcoin...");
      await staking.stake(formData.mBtcAmount);
    } catch (e) {
      toast.error("Failed to stake Bitcoin");
      setPendingStakeAmount(null);
    }
  }

  async function handleUnstakeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(formData.unstakeAmount || "0");
    if (!amt || amt <= 0)
      return toast.error("Please enter a valid unstake amount");
    if (amt > parseFloat(staking.stakedAmount))
      return toast.error("Insufficient staked amount");

    try {
      if (!staking.canUnstake) {
        await staking.startCooldown();
        toast.info(
          "Cooldown started. You can unstake after the cooldown period."
        );
        setShowUnstakeDialog(false);
        return;
      }
      await staking.unstake(formData.unstakeAmount);
      toast.info("Unstaking transaction submitted...");
      setShowUnstakeDialog(false);
    } catch (e) {
      toast.error("Failed to unstake");
    }
  }

  async function handleClaimRewards() {
    try {
      await staking.claimRewards();
      toast.info("Claim rewards transaction submitted...");
    } catch {
      toast.error("Failed to claim rewards");
    }
  }

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    showUnstakeDialog,
    setShowUnstakeDialog,
    pendingStakeAmount,
    processedHash,
    yearlyRewards,
    history,
    historyLoading,
    historyError,
    ...staking,
    handleStakeSubmit,
    handleUnstakeSubmit,
    handleClaimRewards,
  };
}
