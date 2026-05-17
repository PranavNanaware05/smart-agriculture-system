import type { IrrigationResponse, IrrigationStatus } from '../types';

/** Newest first: irrigationDate desc, then id desc (tie-breaker for same-second events). */
export function compareIrrigationEvents(a: IrrigationResponse, b: IrrigationResponse): number {
  const dateDiff = new Date(b.irrigationDate).getTime() - new Date(a.irrigationDate).getTime();
  if (dateDiff !== 0) return dateDiff;
  return b.id - a.id;
}

export function sortIrrigationHistory(history: IrrigationResponse[]): IrrigationResponse[] {
  return [...history].sort(compareIrrigationEvents);
}

/** Latest event defines current irrigation state (not any older RUNNING row). */
export function getLatestIrrigationEvent(history: IrrigationResponse[]): IrrigationResponse | null {
  const sorted = sortIrrigationHistory(history);
  return sorted[0] ?? null;
}

export interface IrrigationUiState {
  sortedHistory: IrrigationResponse[];
  latest: IrrigationResponse | null;
  currentStatus: IrrigationStatus | 'IDLE';
  isRunning: boolean;
  canStart: boolean;
  canStop: boolean;
}

export function deriveIrrigationUiState(history: IrrigationResponse[]): IrrigationUiState {
  const sortedHistory = sortIrrigationHistory(history);
  const latest = sortedHistory[0] ?? null;
  const currentStatus = latest?.irrigationStatus ?? 'IDLE';
  const isRunning = currentStatus === 'RUNNING';

  return {
    sortedHistory,
    latest,
    currentStatus,
    isRunning,
    canStart: !isRunning,
    canStop: isRunning,
  };
}

export function isLatestIrrigationEvent(
  row: IrrigationResponse,
  latest: IrrigationResponse | null,
): boolean {
  return latest !== null && row.id === latest.id;
}
