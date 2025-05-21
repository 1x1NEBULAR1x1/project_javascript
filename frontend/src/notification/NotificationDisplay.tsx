import type { FC } from 'react';
import { useNotification } from './NotificationContext';
import './Notification.css';

const NotificationDisplay: FC = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification notification_${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
};

export default NotificationDisplay; 