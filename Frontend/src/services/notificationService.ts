import api from './api';
import type { NotificationResponse } from '../types';

export const notificationService = {
  list: (farmerId: number) =>
    api.get<NotificationResponse[]>('/notifications', { params: { farmerId } }),
};
