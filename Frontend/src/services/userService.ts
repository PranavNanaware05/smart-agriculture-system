import api from './api';
import type { UserResponse } from '../types';

export const userService = {
  getCurrentUser: () => api.get<UserResponse>('/users/me'),
};
