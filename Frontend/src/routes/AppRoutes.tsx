import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import FarmersPage from '../pages/FarmersPage';
import CropsPage from '../pages/CropsPage';
import IrrigationPage from '../pages/IrrigationPage';
import SensorDataPage from '../pages/SensorDataPage';
import WeatherPage from '../pages/WeatherPage';
import NotificationsPage from '../pages/NotificationsPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/crops" element={<CropsPage />} />
        <Route path="/irrigation" element={<IrrigationPage />} />
        <Route path="/sensors" element={<SensorDataPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
