import type { ReactNode } from 'react';

export function StatCard({
  title,
  value,
  icon,
  accent = 'leaf',
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: 'leaf' | 'sky' | 'amber' | 'violet';
}) {
  const accents = {
    leaf: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-300',
    sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accents[accent]}`}>{icon}</div>
      </div>
    </div>
  );
}
