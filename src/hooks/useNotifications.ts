import { useAtom } from 'jotai';
import { notificationsAtom, addNotificationAtom, removeNotificationAtom, Notification } from './atoms';

export const useNotifications = () => {
  const [notifications] = useAtom(notificationsAtom);
  const [, addNotification] = useAtom(addNotificationAtom);
  const [, removeNotification] = useAtom(removeNotificationAtom);

  const addSuccess = (title: string, message: string) => {
    addNotification({ type: 'success', title, message });
  };

  const addError = (title: string, message: string) => {
    addNotification({ type: 'error', title, message });
  };

  const addWarning = (title: string, message: string) => {
    addNotification({ type: 'warning', title, message });
  };

  const addInfo = (title: string, message: string) => {
    addNotification({ type: 'info', title, message });
  };

  const removeNotificationById = (id: string) => {
    removeNotification(id);
  };

  const clearAll = () => {
    notifications.forEach(notification => {
      removeNotification(notification.id);
    });
  };

  return {
    notifications,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    removeNotificationById,
    clearAll,
  };
};