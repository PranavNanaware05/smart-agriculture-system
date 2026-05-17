import api from './api';
import type { IrrigationControlRequest, IrrigationResponse } from '../types';

export const irrigationService = {
  start: (farmerId: number, data?: IrrigationControlRequest) =>
    api.post<IrrigationResponse>(`/irrigation/farmers/${farmerId}/start`, data ?? {}),
  stop: (farmerId: number, data?: IrrigationControlRequest) =>
    api.post<IrrigationResponse>(`/irrigation/farmers/${farmerId}/stop`, data ?? {}),
  history: (farmerId: number) =>
    api.get<IrrigationResponse[]>(`/irrigation/farmers/${farmerId}/history`),
};
