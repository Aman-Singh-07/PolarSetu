import { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-4 flex items-center justify-center text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full h-[48px] px-4 bg-white border rounded-[10px] text-[14px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 transition-all font-medium disabled:bg-snow disabled:text-muted disabled:cursor-not-allowed",
            error ? "border-error focus:border-error focus:ring-error/20" : "border-border-ice focus:ring-cyan-accent/30 focus:border-glacial-blue",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
