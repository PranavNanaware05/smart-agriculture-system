import type { NotificationResponse } from '../types';

const typeStyles: Record<string, string> = {
  GENERAL: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900',
  LOW_SOIL_MOISTURE: 'border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10',
  HIGH_TEMPERATURE_ALERT: 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10',
  LOW_HUMIDITY_ALERT: 'border-violet-200 bg-violet-50 dark:border-violet-900/30 dark:bg-violet-900/10',
  WEATHER_ALERT: 'border-sky-200 bg-sky-50 dark:border-sky-900/30 dark:bg-sky-900/10',
  IRRIGATION_ALERT: 'border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10',
};

const typeTextColors: Record<string, string> = {
  GENERAL: 'text-slate-900 dark:text-slate-100',
  LOW_SOIL_MOISTURE: 'text-amber-900 dark:text-amber-100',
  HIGH_TEMPERATURE_ALERT: 'text-red-900 dark:text-red-100',
  LOW_HUMIDITY_ALERT: 'text-violet-900 dark:text-violet-100',
  WEATHER_ALERT: 'text-sky-900 dark:text-sky-100',
  IRRIGATION_ALERT: 'text-blue-900 dark:text-blue-100',
};

const typeSubtextColors: Record<string, string> = {
  GENERAL: 'text-slate-700 dark:text-slate-300',
  LOW_SOIL_MOISTURE: 'text-amber-800 dark:text-amber-200',
  HIGH_TEMPERATURE_ALERT: 'text-red-800 dark:text-red-200',
  LOW_HUMIDITY_ALERT: 'text-violet-800 dark:text-violet-200',
  WEATHER_ALERT: 'text-sky-800 dark:text-sky-200',
  IRRIGATION_ALERT: 'text-blue-800 dark:text-blue-200',
};

export function NotificationCard({ notification }: { notification: NotificationResponse }) {
  const style = typeStyles[notification.notificationType] ?? typeStyles.GENERAL;
  const textColor = typeTextColors[notification.notificationType] ?? typeTextColors.GENERAL;
  const subtextColor = typeSubtextColors[notification.notificationType] ?? typeSubtextColors.GENERAL;

  return (
    <article className={`rounded-2xl border-2 p-5 transition hover:shadow-md ${style}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-base ${textColor}`}>{notification.title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${subtextColor}`}>{notification.message}</p>
        </div>
        <span className={`shrink-0 rounded-full ${style} border px-3 py-1 text-xs font-semibold whitespace-nowrap`}>
          {notification.notificationType.replace(/_/g, ' ')}
        </span>
      </div>
      <p className={`mt-3 text-xs ${subtextColor} opacity-75`}>
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </article>
  );
}
