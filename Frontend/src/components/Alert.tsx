import { type ReactNode } from 'react';

export function Alert({
  variant,
  children,
}: {
  variant: 'error' | 'success' | 'info';
  children: ReactNode;
}) {
  const map = {
    error: 'border-red-300 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200',
    success: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-200',
    info: 'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-200',
  };
  return (
    <div
      role="alert"
      className={`rounded-2xl border-2 px-5 py-4 text-sm font-semibold ${map[variant]}`}
    >
      {children}
    </div>
  );
}
