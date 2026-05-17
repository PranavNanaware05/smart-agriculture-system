import { type ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  children,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title ? <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h2> : null}
          {subtitle ? <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{subtitle}</p> : null}
        </div>
      )}
      {children}
    </div>
  );
}
