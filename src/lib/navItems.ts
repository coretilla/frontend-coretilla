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
  Settings
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: any;
}

export interface NavGroup {
  name: string;
  icon: any;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    name: "Transactions",
    icon: CreditCard,
    items: [
      { name: "Deposit", href: "/deposit", icon: CreditCard },
      { name: "Buy Bitcoin", href: "/swap", icon: ArrowRightLeft },
    ]
  },
  {
    name: "Investing", 
    icon: TrendingUp,
    items: [
      { name: "Stake", href: "/stake", icon: Percent },
      { name: "DCA", href: "/dca", icon: CalendarDays },
      { name: "Lending", href: "/lending", icon: PiggyBank },
    ]
  },
  {
    name: "Tools",
    icon: Settings, 
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]
  }
];

// Flattened version for easy access
export const allNavItems: NavItem[] = navGroups.flatMap(group => group.items);