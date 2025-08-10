import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { mobileMenuOpenAtom, activeRouteAtom } from './atoms';

export const useNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useAtom(mobileMenuOpenAtom);
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
  const pathname = usePathname();

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname, setActiveRoute]);

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