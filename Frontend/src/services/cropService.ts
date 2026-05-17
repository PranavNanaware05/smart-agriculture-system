import api from './api';
import type { CropRequest, CropResponse } from '../types';

export const cropService = {
  listByFarmer: (farmerId: number) =>
    api.get<CropResponse[]>('/crops', { params: { farmerId } }),
  getById: (id: number) => api.get<CropResponse>(`/crops/${id}`),
  create: (data: CropRequest) => api.post<CropResponse>('/crops', data),
  update: (id: number, data: CropRequest) => api.put<CropResponse>(`/crops/${id}`, data),
  delete: (id: number) => api.delete(`/crops/${id}`),
};
