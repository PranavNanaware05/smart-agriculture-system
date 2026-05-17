import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { LoginRequest, RegisterRequest, UserResponse } from '../types';
import { storage } from '../utils/storage';
interface AuthContextValue {
  user: UserResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = storage.getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const { data } = await userService.getCurrentUser();
    setUser(data);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (storage.getToken()) {
          await refreshUser();
        }
      } catch {
        storage.clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginRequest) => {
    const { data } = await authService.login(payload);
    storage.setToken(data.accessToken, data.tokenType);
    await refreshUser();
  }, [refreshUser]);

  const register = useCallback(async (payload: RegisterRequest) => {
    const { data } = await authService.register(payload);
    storage.setToken(data.accessToken, data.tokenType);
    await refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && !!storage.getToken(),
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
