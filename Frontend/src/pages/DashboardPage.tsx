import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useFarmer } from '../context/FarmerContext';
import { cropService } from '../services/cropService';
import { irrigationService } from '../services/irrigationService';
import { sensorService } from '../services/sensorService';
import { farmerService } from '../services/farmerService';
import type { SensorDataResponse } from '../types';
import { getErrorMessage } from '../utils/error';

export default function DashboardPage() {
  const { user } = useAuth();
  const { selectedFarmerId, farmers, loading: farmerLoading } = useFarmer();
  const [stats, setStats] = useState({ farmers: 0, crops: 0, irrigation: 0, sensors: 0 });
  const [latestSensor, setLatestSensor] = useState<SensorDataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (user?.role === 'ADMIN') {
          const { data: allFarmers } = await farmerService.list();
          let cropCount = 0;
          let irrigationCount = 0;
          let sensorCount = 0;
          for (const f of allFarmers) {
            const [crops, irrigation, sensors] = await Promise.all([
              cropService.listByFarmer(f.id).catch(() => ({ data: [] })),
              irrigationService.history(f.id).catch(() => ({ data: [] })),
              sensorService.list(f.id).catch(() => ({ data: [] })),
            ]);
            cropCount += crops.data.length;
            irrigationCount += irrigation.data.length;
            sensorCount += sensors.data.length;
          }
          setStats({
            farmers: allFarmers.length,
            crops: cropCount,
            irrigation: irrigationCount,
            sensors: sensorCount,
          });
        } else if (selectedFarmerId) {
          const [crops, irrigation, sensors, latest] = await Promise.all([
            cropService.listByFarmer(selectedFarmerId),
            irrigationService.history(selectedFarmerId),
            sensorService.list(selectedFarmerId),
            sensorService.latest(selectedFarmerId).catch(() => null),
          ]);
          setStats({
            farmers: 1,
            crops: crops.data.length,
            irrigation: irrigation.data.length,
            sensors: sensors.data.length,
          });
          setLatestSensor(latest?.data ?? null);
        } else {
          setStats({ farmers: 0, crops: 0, irrigation: 0, sensors: 0 });
          setLatestSensor(null);
        }
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    if (!farmerLoading) void load();
  }, [user?.role, selectedFarmerId, farmerLoading]);

  if (loading || farmerLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const quickLinks = [
    { to: '/farmers', label: 'Manage farmers', desc: 'Profiles & land details' },
    { to: '/crops', label: 'Crop records', desc: 'Sowing & harvest status' },
    { to: '/irrigation', label: 'Irrigation', desc: 'Start, stop & history' },
    { to: '/sensors', label: 'Sensor data', desc: 'Charts & readings' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Welcome back, {user?.fullName}. {user?.role === 'FARMER' && !selectedFarmerId
            ? 'Create your farmer profile to unlock all features.'
            : 'Here is your farm overview.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Farmers" value={stats.farmers} accent="leaf" icon={<span>👨‍🌾</span>} />
        <StatCard title="Crops" value={stats.crops} accent="amber" icon={<span>🌾</span>} />
        <StatCard title="Irrigation events" value={stats.irrigation} accent="sky" icon={<span>💧</span>} />
        <StatCard title="Sensor readings" value={stats.sensors} accent="violet" icon={<span>📡</span>} />
      </div>

      {latestSensor ? (
        <Card title="Latest sensor reading">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-leaf-50 p-4 text-center">
              <p className="text-sm text-slate-500">Temperature</p>
              <p className="text-2xl font-bold text-leaf-800">{latestSensor.temperature}°C</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-4 text-center">
              <p className="text-sm text-slate-500">Humidity</p>
              <p className="text-2xl font-bold text-sky-800">{latestSensor.humidity}%</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <p className="text-sm text-slate-500">Soil moisture</p>
              <p className="text-2xl font-bold text-amber-800">{latestSensor.soilMoisture}%</p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="glass rounded-2xl p-5 transition hover:border-leaf-200 hover:shadow-md"
          >
            <p className="font-semibold text-slate-900">{link.label}</p>
            <p className="mt-1 text-sm text-slate-500">{link.desc}</p>
          </Link>
        ))}
      </div>

      {user?.role === 'FARMER' && farmers.length === 0 ? (
        <Card>
          <p className="text-slate-600">
            You have not set up your farmer profile yet.{' '}
            <Link to="/farmers" className="font-semibold text-leaf-700">
              Create your profile →
            </Link>
          </p>
        </Card>
      ) : null}
    </div>
  );
}
