import api from './api';
import type { WeatherCurrentResponse, WeatherMetricsResponse } from '../types';

export const weatherService = {
  current: (latitude: number, longitude: number) =>
    api.get<WeatherCurrentResponse>('/weather/current', {
      params: { latitude, longitude },
    }),
  metrics: (latitude: number, longitude: number) =>
    api.get<WeatherMetricsResponse>('/weather/metrics', {
      params: { latitude, longitude },
    }),
  temperature: (latitude: number, longitude: number) =>
    api.get<{ temperatureC: number }>('/weather/temperature', {
      params: { latitude, longitude },
    }),
  humidity: (latitude: number, longitude: number) =>
    api.get<{ humidityPercent: number }>('/weather/humidity', {
      params: { latitude, longitude },
    }),
};
