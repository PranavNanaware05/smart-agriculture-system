import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { weatherService } from '../services/weatherService';
import type { WeatherCurrentResponse } from '../types';
import { getErrorMessage } from '../utils/error';

const DEFAULT_LAT = 12.97;
const DEFAULT_LON = 77.59;

export default function WeatherPage() {
  const [latitude, setLatitude] = useState(String(DEFAULT_LAT));
  const [longitude, setLongitude] = useState(String(DEFAULT_LON));
  const [weather, setWeather] = useState<WeatherCurrentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e?: FormEvent) => {
    e?.preventDefault();
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      toast.error('Enter valid coordinates');
      return;
    }
    setLoading(true);
    try {
      const { data } = await weatherService.current(lat, lon);
      setWeather(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Weather</h1>
        <p className="text-slate-600">Live temperature and humidity from Open-Meteo</p>
      </div>

      <Card title="Location">
        <form onSubmit={fetchWeather} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[140px] flex-1">
            <label className="label-field">Latitude</label>
            <input className="input-field" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
          </div>
          <div className="min-w-[140px] flex-1">
            <label className="label-field">Longitude</label>
            <input className="input-field" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : 'Fetch weather'}
          </button>
        </form>
      </Card>

      {weather ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-500">Temperature</p>
            <p className="mt-2 text-4xl font-bold text-leaf-700">{weather.temperatureC}°C</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Humidity</p>
            <p className="mt-2 text-4xl font-bold text-sky-700">{weather.humidityPercent}%</p>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-slate-500">Summary</p>
            <p className="mt-2 text-lg font-medium text-slate-800">{weather.summary || '—'}</p>
            <p className="mt-2 text-xs text-slate-500">
              Fetched {new Date(weather.fetchedAt).toLocaleString()}
            </p>
          </Card>
        </div>
      ) : (
        <Card>
          <p className="text-center text-slate-500">Enter coordinates and fetch weather data.</p>
        </Card>
      )}
    </div>
  );
}
