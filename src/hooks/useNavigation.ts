import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { mobileMenuOpenAtom, activeRouteAtom } from './atoms';

export const useNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(mobileMenuOpenAtom);
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
  const pathname = usePathname();

  // Update active route when pathname changes
  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname, setActiveRoute]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  return {
    mobileMenuOpen,
    activeRoute,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
  };
};