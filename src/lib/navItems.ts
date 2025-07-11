import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowRightLeft, 
  Percent, 
  PiggyBank, 
  DollarSign, 
  CalendarDays, 
  BarChart3,
  TrendingUp,
  Droplets
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: any;
}

export interface NavGroup {
  name: string;
  emoji: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    name: "Transactions",
    emoji: "",
    items: [
      { name: "Deposit", href: "/deposit", icon: CreditCard },
      { name: "Swap", href: "/swap", icon: ArrowRightLeft },
      { name: "Fiat", href: "/fiat", icon: DollarSign },
    ]
  },
  {
    name: "Investing", 
    emoji: "",
    items: [
      { name: "Stake", href: "/stake", icon: Percent },
      { name: "DCA", href: "/dca", icon: CalendarDays },
      { name: "Lending", href: "/lending", icon: PiggyBank },
    ]
  },
  {
    name: "Tools",
    emoji: "", 
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analyzer", href: "/analyzer", icon: BarChart3 },
      { name: "Faucet", href: "/faucet", icon: Droplets },
    ]
  }
];

// Flattened version for easy access
export const allNavItems: NavItem[] = navGroups.flatMap(group => group.items);