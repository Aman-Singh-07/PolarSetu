import clsx from 'clsx';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("animate-soft-pulse rounded-md bg-border-ice/50", className)}
      {...props}
    />
  );
}
