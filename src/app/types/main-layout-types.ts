import { ReactNode } from "react";
export interface MainLayoutProps {
  children: ReactNode;
}

export interface PageTransitionProps {
  children: ReactNode;
}
export interface PageWrapperProps {
  children: ReactNode;
  title?: string | ReactNode;
  subtitle?: string;
  className?: string;
}

export * from "./main-layout-types";
