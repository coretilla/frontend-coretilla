import { atom } from 'jotai';

export interface BTCPriceData {
  price: number;
  changePercent: number;
  lastUpdated: number;
}

export const btcPriceAtom = atom<BTCPriceData | null>(null);
export const btcPriceLoadingAtom = atom<boolean>(false);
export const btcPriceErrorAtom = atom<string | null>(null);

export const mobileMenuOpenAtom = atom<boolean>(false);
export const isScrolledAtom = atom<boolean>(false);

export const activeRouteAtom = atom<string>('');

export const walletConnectedAtom = atom<boolean>(false);
export const walletAddressAtom = atom<string | null>(null);
export const walletBalanceAtom = atom<string>('0.00000000');

export const themeAtom = atom<'light' | 'dark'>('light');

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

export const notificationsAtom = atom<Notification[]>([]);

export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    const currentNotifications = get(notificationsAtom);
    set(notificationsAtom, [...currentNotifications, newNotification]);
    
    setTimeout(() => {
      const notifications = get(notificationsAtom);
      set(notificationsAtom, notifications.filter(n => n.id !== newNotification.id));
    }, 5000);
  }
);

export const removeNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    const notifications = get(notificationsAtom);
    set(notificationsAtom, notifications.filter(n => n.id !== id));
  }
);