"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function useRouteLoader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const navigateWithLoader = (href: string) => {
    setIsLoading(true);
    startTransition(() => {
      router.push(href);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    });
  };

  const isNavigating = isPending || isLoading;

  return {
    navigateWithLoader,
    isNavigating,
    isPending,
    isLoading,
  };
}
