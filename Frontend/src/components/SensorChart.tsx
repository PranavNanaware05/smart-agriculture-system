import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SensorDataResponse } from '../types';

export function SensorChart({ data }: { data: SensorDataResponse[] }) {
  const chartData = [...data]
    .reverse()
    .slice(-20)
    .map((row) => ({
      time: new Date(row.recordedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temperature: Number(row.temperature),
      humidity: Number(row.humidity),
      soilMoisture: Number(row.soilMoisture),
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#16a34a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="soilMoisture" name="Soil (%)" stroke="#d97706" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
