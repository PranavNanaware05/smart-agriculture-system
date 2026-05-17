import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFarmer } from '../context/FarmerContext';
import { irrigationService } from '../services/irrigationService';
import type { IrrigationResponse } from '../types';
import { getErrorMessage } from '../utils/error';
import {
  deriveIrrigationUiState,
  isLatestIrrigationEvent,
  sortIrrigationHistory,
} from '../utils/irrigationState';

function mergeHistoryEntry(
  prev: IrrigationResponse[],
  entry: IrrigationResponse,
): IrrigationResponse[] {
  const without = prev.filter((row) => row.id !== entry.id);
  return sortIrrigationHistory([entry, ...without]);
}

export default function IrrigationPage() {
  const { selectedFarmerId } = useFarmer();
  const [history, setHistory] = useState<IrrigationResponse[]>([]);
  const [waterLevel, setWaterLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const actionLockRef = useRef(false);
  const farmerIdRef = useRef(selectedFarmerId);
  farmerIdRef.current = selectedFarmerId;

  const { sortedHistory, latest, currentStatus, isRunning, canStart, canStop } = useMemo(
    () => deriveIrrigationUiState(history),
    [history],
  );

  const buildControlBody = useCallback(() => {
    const level = waterLevel.trim() ? Number(waterLevel) : undefined;
    return level !== undefined && !Number.isNaN(level) ? { waterLevel: level } : undefined;
  }, [waterLevel]);

  const fetchHistory = useCallback(async (farmerId: number, signal?: AbortSignal) => {
    const { data } = await irrigationService.history(farmerId);
    if (signal?.aborted) return;
    setHistory(sortIrrigationHistory(data));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      if (!selectedFarmerId) {
        setHistory([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await fetchHistory(selectedFarmerId, controller.signal);
      } catch (err) {
        if (!controller.signal.aborted) {
          toast.error(getErrorMessage(err));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => controller.abort();
  }, [selectedFarmerId, fetchHistory]);

  const runAction = async (
    action: 'start' | 'stop',
    apiCall: () => Promise<{ data: IrrigationResponse }>,
  ) => {
    const farmerId = farmerIdRef.current;
    if (!farmerId || actionLockRef.current || acting) return;

    actionLockRef.current = true;
    setActing(true);

    try {
      const { data } = await apiCall();
      if (farmerIdRef.current !== farmerId) return;
      setHistory((prev) => mergeHistoryEntry(prev, data));
      toast.success(action === 'start' ? 'Irrigation started' : 'Irrigation stopped');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      actionLockRef.current = false;
      setActing(false);
    }
  };

  const handleStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canStart || acting) return;
    void runAction('start', () =>
      irrigationService.start(farmerIdRef.current!, buildControlBody()),
    );
  };

  const handleStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canStop || acting) return;
    void runAction('stop', () =>
      irrigationService.stop(farmerIdRef.current!, buildControlBody()),
    );
  };

  const preventImplicitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!selectedFarmerId) {
    return <EmptyState title="No farmer selected" description="Select a farmer to control irrigation." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Irrigation</h1>
        <p className="text-slate-600">Start, stop, and review irrigation history</p>
      </div>

      <Card title="Controls">
        <form onSubmit={preventImplicitSubmit} className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[160px] flex-1">
              <label className="label-field" htmlFor="water-level">
                Water level (optional)
              </label>
              <input
                id="water-level"
                type="number"
                min="0"
                step="0.1"
                className="input-field"
                placeholder="e.g. 75"
                value={waterLevel}
                onChange={(e) => setWaterLevel(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-primary"
              disabled={acting || !canStart}
              onClick={handleStart}
            >
              Start irrigation
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={acting || !canStop}
              onClick={handleStop}
            >
              Stop irrigation
            </button>
          </div>
        </form>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Current status
          </p>
          {latest ? (
            <p className="mt-1 text-sm text-slate-700">
              <strong
                className={
                  isRunning ? 'text-sky-700' : currentStatus === 'STOPPED' ? 'text-slate-800' : 'text-slate-700'
                }
              >
                {currentStatus}
              </strong>
              {' — '}
              motor {latest.motorState}, water {latest.waterLevel ?? '—'}% at{' '}
              {new Date(latest.irrigationDate).toLocaleString()}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">IDLE — no irrigation events yet.</p>
          )}
        </div>
      </Card>

      <Card title="History" subtitle="All events (newest first). Current state follows the latest row.">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : sortedHistory.length === 0 ? (
          <EmptyState title="No history yet" description="Start irrigation to create the first record." />
        ) : (
          <div className="space-y-3">
            {sortedHistory.map((row) => {
              const isCurrent = isLatestIrrigationEvent(row, latest);
              return (
                <div
                  key={row.id}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm ${
                    isCurrent
                      ? 'border-leaf-200 bg-leaf-50/60'
                      : 'border-slate-100 bg-slate-50/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-semibold ${
                        row.irrigationStatus === 'RUNNING' ? 'text-sky-700' : 'text-slate-700'
                      }`}
                    >
                      {row.irrigationStatus}
                    </span>
                    {isCurrent ? (
                      <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-xs font-medium text-leaf-800">
                        Current
                      </span>
                    ) : null}
                  </div>
                  <span>Motor: {row.motorState}</span>
                  <span>Water: {row.waterLevel ?? '—'}%</span>
                  <span className="text-slate-500">
                    {new Date(row.irrigationDate).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
