import { 
  Home, 
  BarChart3, 
  CreditCard, 
  ArrowUpDown, 
  Building2, 
  TrendingUp, 
  Calendar, 
  Coins, 
  DollarSign, 
  Brain,
  ChevronDown
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface MobileNavSection {
  title: string;
  emoji: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

// Main navigation items for desktop dropdowns
export const navGroups: NavGroup[] = [
  {
    title: "Products",
    items: [
      {
        name: "Deposit",
        href: "/deposit",
        icon: CreditCard,
        description: "Add funds to your account"
      },
      {
        name: "Buy Bitcoin",
        href: "/swap",
        icon: ArrowUpDown,
        description: "Buy Bitcoin with USD"
      }
    ]
  },
  {
    title: "Investing",
    items: [
      {
        name: "Stake",
        href: "/stake",
        icon: Coins,
        description: "Stake lstBTC for rewards"
      },
      {
        name: "Lending",
        href: "/lending",
        icon: DollarSign,
        description: "Lend & borrow assets"
      },
      {
        name: "DCA",
        href: "/dca",
        icon: Calendar,
        description: "Dollar-cost averaging"
      }
    ]
  },
  {
    title: "Tools",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: BarChart3,
        description: "Portfolio tracker"
      },
    ]
  }
];

// Mobile navigation sections with collapsible groups
export const mobileNavSections: MobileNavSection[] = [
  {
    title: "Products",
    emoji: "💳",
    defaultOpen: true,
    items: [
      {
        name: "Deposit",
        href: "/deposit",
        icon: CreditCard,
        description: "Add funds to your account"
      },
      {
        name: "Buy Bitcoin",
        href: "/swap",
        icon: ArrowUpDown,
        description: "Buy Bitcoin with USD"
      }
    ]
  },
  {
    title: "Investing",
    emoji: "📈",
    items: [
      {
        name: "Stake",
        href: "/stake",
        icon: Coins,
        description: "Stake lstBTC for rewards"
      },
      {
        name: "Lending",
        href: "/lending",
        icon: DollarSign,
        description: "Lend & borrow assets"
      },
      {
        name: "DCA",
        href: "/dca",
        icon: Calendar,
        description: "Dollar-cost averaging"
      }
    ]
  },
  {
    title: "Tools",
    emoji: "📊",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: BarChart3,
        description: "Portfolio tracker"
      },
    ]
  }
];

// Quick access items (always visible)
export const quickAccessItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home
  }
];