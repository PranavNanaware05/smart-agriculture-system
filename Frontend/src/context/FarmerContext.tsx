import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { farmerService } from '../services/farmerService';
import { resolveFarmerForUser } from '../services/farmerResolver';
import type { FarmerResponse } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

interface FarmerContextValue {
  farmers: FarmerResponse[];
  selectedFarmer: FarmerResponse | null;
  selectedFarmerId: number | null;
  hasFarmerProfile: boolean;
  loading: boolean;
  setSelectedFarmerId: (id: number | null) => void;
  refreshFarmers: () => Promise<void>;
}

const FarmerContext = createContext<FarmerContextValue | null>(null);

export function FarmerProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [farmers, setFarmers] = useState<FarmerResponse[]>([]);
  const [selectedFarmerId, setSelectedFarmerIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const setSelectedFarmerId = useCallback(
    (id: number | null) => {
      setSelectedFarmerIdState(id);
      if (id && user) storage.setFarmerIdForUser(user.id, id);
    },
    [user],
  );

  const refreshFarmers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'ADMIN') {
        const { data } = await farmerService.list();
        setFarmers(data);
        setSelectedFarmerIdState((current) => {
          if (current && data.some((f) => f.id === current)) return current;
          const stored = storage.getFarmerIdForUser(user.id);
          const match = stored ? data.find((f) => f.id === stored) : data[0];
          const next = match?.id ?? data[0]?.id ?? null;
          if (next) storage.setFarmerIdForUser(user.id, next);
          return next;
        });
      } else {
        const farmer = await resolveFarmerForUser(user.id);
        if (farmer) {
          setFarmers([farmer]);
          setSelectedFarmerIdState(farmer.id);
          storage.setFarmerIdForUser(user.id, farmer.id);
        } else {
          setFarmers([]);
          setSelectedFarmerIdState(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      void refreshFarmers();
    } else {
      setFarmers([]);
      setSelectedFarmerIdState(null);
    }
  }, [isAuthenticated, user?.id, user?.role, refreshFarmers]);

  const selectedFarmer = useMemo(
    () => farmers.find((f) => f.id === selectedFarmerId) ?? farmers[0] ?? null,
    [farmers, selectedFarmerId],
  );

  const effectiveFarmerId = selectedFarmerId ?? selectedFarmer?.id ?? null;

  const value = useMemo(
    () => ({
      farmers,
      selectedFarmer,
      selectedFarmerId: effectiveFarmerId,
      hasFarmerProfile: farmers.length > 0,
      loading,
      setSelectedFarmerId,
      refreshFarmers,
    }),
    [farmers, selectedFarmer, effectiveFarmerId, loading, setSelectedFarmerId, refreshFarmers],
  );

  return <FarmerContext.Provider value={value}>{children}</FarmerContext.Provider>;
}

export function useFarmer() {
  const ctx = useContext(FarmerContext);
  if (!ctx) throw new Error('useFarmer must be used within FarmerProvider');
  return ctx;
}
