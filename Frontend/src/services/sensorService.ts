import api from './api';
import type { SensorDataResponse } from '../types';

export const sensorService = {
  list: (farmerId: number) =>
    api.get<SensorDataResponse[]>('/sensor-data', { params: { farmerId } }),
  latest: (farmerId: number) =>
    api.get<SensorDataResponse>('/sensor-data/latest', { params: { farmerId } }),
};
