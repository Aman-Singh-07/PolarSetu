import clsx from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'ocean' | 'cyan' | 'success' | 'warning' | 'error' | 'outline';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-frost text-deep-ocean border-border-ice",
    ocean: "bg-deep-ocean text-white border-deep-ocean",
    cyan: "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/20",
    success: "bg-emerald/10 text-emerald border-emerald/20",
    warning: "bg-amber-warn/10 text-amber-warn border-amber-warn/20",
    error: "bg-error/10 text-error border-error/20",
    outline: "bg-transparent text-muted border-border-ice",
  };

  return (
    <span 
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
