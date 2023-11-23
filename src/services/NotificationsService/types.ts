export type Status = 'enabled' | 'disabled';

export interface EnableTelegramNotifications {
  status: Status;
}

export interface Notification {
  id: number;
  slug: string;
  name: string;
}

export interface AllNotificationsListType {
  notification: Notification[];
}

export interface UserNotificationsPayload {
  notifications: number[];
}

export interface NotificationTarget {
  id: number;
  slug: string;
}

export interface NotificationTargetsPayload {
  targets: number[];
}
