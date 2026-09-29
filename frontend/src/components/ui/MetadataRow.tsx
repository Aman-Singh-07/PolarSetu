import clsx from 'clsx';
import type { ReactNode } from 'react';

interface MetadataRowProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
  dark?: boolean;
}

export function MetadataRow({ label, value, icon, className, dark }: MetadataRowProps) {
  return (
    <div className={clsx("flex items-start justify-between py-3 border-b", dark ? "border-white/10" : "border-border-ice", className)}>
      <div className="flex items-center gap-2">
        {icon && <span className={dark ? "text-white/40" : "text-muted/60"}>{icon}</span>}
        <span className={clsx("text-[13px] font-bold uppercase tracking-[0.1em]", dark ? "text-white/60" : "text-muted")}>
          {label}
        </span>
      </div>
      <div className={clsx("text-[14px] font-medium text-right max-w-[60%]", dark ? "text-white" : "text-ink")}>
        {value}
      </div>
    </div>
  );
}
