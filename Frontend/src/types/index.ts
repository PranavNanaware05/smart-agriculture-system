export type Role = 'FARMER' | 'ADMIN';

export type CropStatus =
  | 'PLANNED'
  | 'SOWING'
  | 'GROWING'
  | 'READY_TO_HARVEST'
  | 'HARVESTED'
  | 'FAILED';

export type NotificationType =
  | 'GENERAL'
  | 'LOW_SOIL_MOISTURE'
  | 'HIGH_TEMPERATURE_ALERT'
  | 'LOW_HUMIDITY_ALERT'
  | 'WEATHER_ALERT'
  | 'IRRIGATION_ALERT';

export type IrrigationStatus = 'IDLE' | 'RUNNING' | 'STOPPED';
export type MotorState = 'ON' | 'OFF';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  phoneNumber: string;
  enabled: boolean;
  createdAt: string;
}

export interface FarmerRequest {
  userId?: number | null;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  landArea: number;
  soilType: string;
}

export interface FarmerResponse {
  id: number;
  userId: number;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  landArea: number;
  soilType: string;
}

export interface CropRequest {
  farmerId: number;
  cropName: string;
  cropType: string;
  sowingDate: string;
  harvestingDate?: string | null;
  cropStatus: CropStatus;
}

export interface CropResponse {
  id: number;
  farmerId: number;
  cropName: string;
  cropType: string;
  sowingDate: string;
  harvestingDate?: string | null;
  cropStatus: CropStatus;
}

export interface IrrigationControlRequest {
  waterLevel?: number;
}

export interface IrrigationResponse {
  id: number;
  farmerId: number;
  irrigationStatus: IrrigationStatus;
  waterLevel: number;
  motorState: MotorState;
  irrigationDate: string;
}

export interface SensorDataResponse {
  id: number;
  farmerId: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  recordedAt: string;
}

export interface WeatherMetricsResponse {
  temperatureC: number;
  humidityPercent: number;
}

export interface WeatherCurrentResponse {
  latitude: number;
  longitude: number;
  temperatureC: number;
  humidityPercent: number;
  summary: string;
  fetchedAt: string;
}

export interface NotificationResponse {
  id: number;
  farmerId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  createdAt: string;
}

export interface FieldViolation {
  field: string;
  message: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: FieldViolation[];
}

export interface DashboardStats {
  farmers: number;
  crops: number;
  irrigationEvents: number;
  sensorReadings: number;
}
