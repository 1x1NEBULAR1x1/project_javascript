import { createContext, useState, useContext, type ReactNode } from 'react';

export type NotificationType = 'success' | 'error';

interface Notification {
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (type: NotificationType, message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  timeout?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  timeout = 3000
}) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), timeout);
  };

  const showSuccess = (message: string) => showNotification('success', message);
  const showError = (message: string) => showNotification('error', message);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        showNotification,
        showSuccess,
        showError
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;