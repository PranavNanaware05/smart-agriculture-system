import type { AxiosError } from 'axios';
import { farmerService } from './farmerService';
import type { FarmerResponse } from '../types';
import { storage } from '../utils/storage';

const MAX_FARMER_ID_SCAN = 200;
const SCAN_BATCH_SIZE = 20;

function isAccessibleFarmer(error: unknown): boolean {
  const status = (error as AxiosError)?.response?.status;
  return status === 403 || status === 404;
}

async function tryGetFarmerById(id: number, userId: number): Promise<FarmerResponse | null> {
  try {
    const { data } = await farmerService.getById(id);
    return data.userId === userId ? data : null;
  } catch (error) {
    if (isAccessibleFarmer(error)) return null;
    throw error;
  }
}

async function scanForFarmerProfile(userId: number): Promise<FarmerResponse | null> {
  for (let start = 1; start <= MAX_FARMER_ID_SCAN; start += SCAN_BATCH_SIZE) {
    const ids = Array.from({ length: SCAN_BATCH_SIZE }, (_, i) => start + i);
    const results = await Promise.all(ids.map((id) => tryGetFarmerById(id, userId)));
    const found = results.find((f): f is FarmerResponse => f !== null);
    if (found) return found;
  }
  return null;
}

/**
 * Resolves the farmer profile for a FARMER user without a dedicated list-by-user API.
 * Uses cached id first, then scans GET /farmers/{id} until one matches userId.
 */
export async function resolveFarmerForUser(userId: number): Promise<FarmerResponse | null> {
  const cachedId = storage.getFarmerIdForUser(userId);
  if (cachedId) {
    const cached = await tryGetFarmerById(cachedId, userId);
    if (cached) return cached;
    storage.clearFarmerIdForUser(userId);
  }

  const discovered = await scanForFarmerProfile(userId);
  if (discovered) {
    storage.setFarmerIdForUser(userId, discovered.id);
  }
  return discovered;
}

export function isFarmerAlreadyExistsError(error: unknown): boolean {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (axiosError.response?.status !== 409) return false;
  const message = axiosError.response.data?.message?.toLowerCase() ?? '';
  return message.includes('farmer profile already exists');
}
