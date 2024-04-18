import { api } from '@/api/Api';
import { AxiosBaseResponse, Token } from '@/api/types';
import {
  EnableTelegramNotifications,
  AllNotificationsListType,
  Notification,
  UserNotificationsPayload,
  NotificationTarget,
  NotificationTargetsPayload,
} from './types';

export default class NotificationsService {
  public static async startTelegramBot(token: Token): Promise<AxiosBaseResponse<string[]>> {
    return api.post('/telegram/start', null, token);
  }

  public static async enableTelegramNotifications(payload: EnableTelegramNotifications, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/telegram/notification', payload, token);
  }

  public static async getAllNotificationsList(token: Token): Promise<AxiosBaseResponse<AllNotificationsListType[]>> {
    return api.get('/notifications/list', null, token);
  }

  public static async getUserNotificationsList(token: Token): Promise<AxiosBaseResponse<Notification[]>> {
    return api.get('/notifications', null, token);
  }

  public static async saveUserNotifications(payload: UserNotificationsPayload, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/notifications', payload, token);
  }

  public static async getAllNotificationsTargets(token: Token): Promise<AxiosBaseResponse<NotificationTarget[]>> {
    return api.get('/notifications/targets/list', null, token);
  }

  public static async getUserNotificationsTargets(token: Token): Promise<AxiosBaseResponse<NotificationTarget[]>> {
    return api.get('/notifications/targets', null, token);
  }

  public static async saveUserNotificationsTargets(payload: NotificationTargetsPayload, token: Token): Promise<AxiosBaseResponse<void>> {
    return api.post('/notifications/targets', payload, token);
  }

  public static async processingTelegram(token: Token): Promise<AxiosBaseResponse<string[]>> {
    return api.get('/telegram/processing/', null, token);
  }
}
