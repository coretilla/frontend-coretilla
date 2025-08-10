import { NavGroup } from "@/config/navItems";
export interface MenuGroupDropdownProps {
  group: NavGroup;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface NavItem {
  name: string;
  href: string;
  icon: any;
}

export interface NavGroups {
  name: string;
  icon: any;
  items: NavItem[];
}

export interface NavItem {
    name: string;
    href: string;
    icon: any;
  }
  
  export interface NavigatorGroup {
    name: string;
    icon: any;
    items: NavItem[];
  }

export * from "./navbar-types";
