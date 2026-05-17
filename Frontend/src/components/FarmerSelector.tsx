import { useFarmer } from '../context/FarmerContext';
import { useAuth } from '../context/AuthContext';

export function FarmerSelector() {
  const { user } = useAuth();
  const { farmers, selectedFarmerId, setSelectedFarmerId, loading } = useFarmer();

  if (user?.role !== 'ADMIN' || farmers.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label htmlFor="farmer-select" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Select Farmer:
      </label>
      <select
        id="farmer-select"
        className="input-field py-2.5 text-sm sm:max-w-xs"
        value={selectedFarmerId ?? ''}
        disabled={loading}
        onChange={(e) => setSelectedFarmerId(Number(e.target.value))}
      >
        <option value="">-- Choose a farmer --</option>
        {farmers.map((f) => (
          <option key={f.id} value={f.id}>
            {f.farmerName} • {f.village}
          </option>
        ))}
      </select>
    </div>
  );
}
