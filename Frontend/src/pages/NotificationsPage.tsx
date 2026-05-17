import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NotificationCard } from '../components/NotificationCard';
import { useFarmer } from '../context/FarmerContext';
import { notificationService } from '../services/notificationService';
import type { NotificationResponse } from '../types';
import { getErrorMessage } from '../utils/error';

export default function NotificationsPage() {
  const { selectedFarmerId } = useFarmer();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (!selectedFarmerId) {
        setNotifications([]);
        setLoading(false);
        return;
      }
      try {
        const { data } = await notificationService.list(selectedFarmerId);
        if (!controller.signal.aborted) {
          setNotifications(data);
        }
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

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 15000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [selectedFarmerId]);

  if (!selectedFarmerId) {
    return <EmptyState title="No farmer selected" description="Select a farmer to view notifications." />;
  }

  const alerts = notifications.filter((n) => n.notificationType !== 'GENERAL');
  const general = notifications.filter((n) => n.notificationType === 'GENERAL');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-600">Alerts and messages for your farm</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="Alerts will appear here when triggered." />
      ) : (
        <>
          {alerts.length > 0 ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-amber-800">⚠️ Warnings & alerts</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {alerts.map((n) => (
                  <NotificationCard key={n.id} notification={n} />
                ))}
              </div>
            </section>
          ) : null}

          {general.length > 0 ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-800">Messages</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {general.map((n) => (
                  <NotificationCard key={n.id} notification={n} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
