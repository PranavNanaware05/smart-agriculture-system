import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SensorChart } from '../components/SensorChart';
import { useFarmer } from '../context/FarmerContext';
import { sensorService } from '../services/sensorService';
import type { SensorDataResponse } from '../types';
import { getErrorMessage } from '../utils/error';

export default function SensorDataPage() {
  const { selectedFarmerId } = useFarmer();
  const [readings, setReadings] = useState<SensorDataResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!selectedFarmerId) {
        setReadings([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await sensorService.list(selectedFarmerId);
        setReadings(data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [selectedFarmerId]);

  if (!selectedFarmerId) {
    return <EmptyState title="No farmer selected" description="Select a farmer to view sensor data." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sensor Data</h1>
        <p className="text-slate-600">Temperature, humidity, and soil moisture readings</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : readings.length === 0 ? (
        <EmptyState title="No sensor readings" description="Sensor data will appear here once recorded via the API." />
      ) : (
        <>
          <Card title="Trends" subtitle="Last 20 readings">
            <SensorChart data={readings} />
          </Card>

          <Card title="All readings">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-100 text-slate-600">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Time</th>
                    <th className="py-2 pr-4 font-medium">Temp (°C)</th>
                    <th className="py-2 pr-4 font-medium">Humidity (%)</th>
                    <th className="py-2 font-medium">Soil (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50">
                      <td className="py-2 pr-4">{new Date(r.recordedAt).toLocaleString()}</td>
                      <td className="py-2 pr-4">{r.temperature}</td>
                      <td className="py-2 pr-4">{r.humidity}</td>
                      <td className="py-2">{r.soilMoisture}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
