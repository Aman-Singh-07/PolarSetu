import clsx from 'clsx';

interface StatusLabelProps {
  status: string;
  className?: string;
}

export function StatusLabel({ status, className }: StatusLabelProps) {
  const isApproved = status === 'APPROVED' || status === 'PUBLISHED';
  const isRejected = status === 'REJECTED';
  
  return (
    <span className={clsx(
      "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] border shadow-sm inline-flex items-center justify-center",
      isApproved ? "bg-emerald/10 text-emerald border-emerald/20" :
      isRejected ? "bg-error/10 text-error border-error/20" :
      "bg-amber-bg text-amber-warn border-amber-warn/20",
      className
    )}>
      {status === 'DRAFT' ? 'Pending Review' : status}
    </span>
  );
}
