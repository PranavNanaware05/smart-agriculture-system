import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-sky-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-12 lg:flex-row lg:gap-16">
        <div className="mb-10 max-w-md text-center lg:mb-0 lg:text-left">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-600 text-2xl text-white shadow-lg shadow-leaf-600/30">
            🌱
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Smart Agriculture System
          </h1>
          <p className="mt-3 text-slate-600">
            Monitor crops, irrigation, sensors, and weather — all in one modern dashboard.
          </p>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
