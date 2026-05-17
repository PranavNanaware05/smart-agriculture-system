const TOKEN_KEY = 'accessToken';
const TOKEN_TYPE_KEY = 'tokenType';
const LEGACY_FARMER_ID_KEY = 'farmerId';

const farmerIdKey = (userId: number) => `farmerId:${userId}`;

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string, tokenType = 'Bearer') => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
  },
  getTokenType: () => localStorage.getItem(TOKEN_TYPE_KEY) ?? 'Bearer',
  /** Clears auth tokens only — farmer IDs are kept per user so profiles reload after login. */
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
  },
  getFarmerIdForUser: (userId: number): number | null => {
    const scoped = localStorage.getItem(farmerIdKey(userId));
    if (scoped) return Number(scoped);

    const legacy = localStorage.getItem(LEGACY_FARMER_ID_KEY);
    if (legacy) {
      const id = Number(legacy);
      storage.setFarmerIdForUser(userId, id);
      localStorage.removeItem(LEGACY_FARMER_ID_KEY);
      return id;
    }
    return null;
  },
  setFarmerIdForUser: (userId: number, farmerId: number) => {
    localStorage.setItem(farmerIdKey(userId), String(farmerId));
  },
  clearFarmerIdForUser: (userId: number) => {
    localStorage.removeItem(farmerIdKey(userId));
  },
  /** @deprecated Use getFarmerIdForUser with the current user id */
  getFarmerId: (): number | null => {
    const legacy = localStorage.getItem(LEGACY_FARMER_ID_KEY);
    return legacy ? Number(legacy) : null;
  },
  setFarmerId: (id: number) => localStorage.setItem(LEGACY_FARMER_ID_KEY, String(id)),
  clearFarmerId: () => localStorage.removeItem(LEGACY_FARMER_ID_KEY),
};
