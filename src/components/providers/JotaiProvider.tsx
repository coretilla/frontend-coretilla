"use client";

import { Provider } from "jotai";
import { JotaiProviderProps } from "@/app/types/jotai-types";

export default function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}
