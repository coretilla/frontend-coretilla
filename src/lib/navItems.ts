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
    emoji: "💳",
    items: [
      { name: "Deposit", href: "/deposit", icon: CreditCard },
      { name: "Buy Bitcoin", href: "/swap", icon: ArrowRightLeft },
    ]
  },
  {
    name: "Investing", 
    emoji: "📈",
    items: [
      { name: "Stake", href: "/stake", icon: Percent },
      { name: "DCA", href: "/dca", icon: CalendarDays },
      { name: "Lending", href: "/lending", icon: PiggyBank },
    ]
  },
  {
    name: "Tools",
    emoji: "🔧", 
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Faucet", href: "/faucet", icon: Droplets },
    ]
  }
];

// Flattened version for easy access
export const allNavItems: NavItem[] = navGroups.flatMap(group => group.items);