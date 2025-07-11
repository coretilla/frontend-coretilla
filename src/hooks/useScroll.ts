import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { isScrolledAtom } from './atoms';

export const useScroll = (threshold: number = 10) => {
  const [isScrolled, setIsScrolled] = useAtom(isScrolledAtom);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold;
      setIsScrolled(scrolled);
    };

    // Initial check
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, setIsScrolled]);

  return { isScrolled };
};