import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Percent,
  PiggyBank,
  CalendarDays,
  TrendingUp,
  Settings,
  House,
} from "lucide-react";
import { NavItem, NavigatorGroup } from "@/app/types/navbar-types";

export const navGroups: NavigatorGroup[] = [
  {
    name: "Home",
    icon: House,
    items: [{ name: "Home", href: "/", icon: House }],
  },

  {
    name: "Transactions",
    icon: CreditCard,
    items: [
      { name: "Deposit", href: "/deposit", icon: CreditCard },
      { name: "Buy Bitcoin", href: "/swap", icon: ArrowRightLeft },
    ],
  },
  {
    name: "Investing",
    icon: TrendingUp,
    items: [
      { name: "Stake", href: "/stake", icon: Percent },
      { name: "DCA Simulation", href: "/dca", icon: CalendarDays },
      { name: "Lending", href: "/lending", icon: PiggyBank },
    ],
  },
  {
    name: "Dashboard",
    icon: Settings,
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((group) => group.items);
