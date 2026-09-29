import clsx from 'clsx';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, children, dark, className }: PageHeaderProps) {
  return (
    <section className={clsx("w-full pt-12 pb-10 border-b", dark ? "bg-ocean-navy/80 border-white/10" : "bg-white/60 border-border-ice", className)}>
      <div className="container-standard flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          {eyebrow && (
            <span className={clsx("text-[11px] font-bold uppercase tracking-[0.2em]", dark ? "text-cyan-accent" : "text-cyan-accent")}>
              {eyebrow}
            </span>
          )}
          <h1 className={clsx("font-display text-4xl font-extrabold tracking-tight", dark ? "text-white" : "text-deep-ocean")}>
            {title}
          </h1>
          {description && (
            <p className={clsx("text-[16px] max-w-2xl font-medium", dark ? "text-white/60" : "text-muted")}>
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
