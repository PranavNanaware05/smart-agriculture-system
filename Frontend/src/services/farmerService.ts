import api from './api';
import type { FarmerRequest, FarmerResponse } from '../types';

export const farmerService = {
  list: () => api.get<FarmerResponse[]>('/farmers'),
  getById: (id: number) => api.get<FarmerResponse>(`/farmers/${id}`),
  create: (data: FarmerRequest) => api.post<FarmerResponse>('/farmers', data),
  update: (id: number, data: FarmerRequest) => api.put<FarmerResponse>(`/farmers/${id}`, data),
  delete: (id: number) => api.delete(`/farmers/${id}`),
};
