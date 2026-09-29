import { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
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
            "w-full h-[48px] px-4 bg-white border border-border-ice rounded-[10px] text-[14px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cyan-accent/30 focus:border-glacial-blue transition-all font-medium",
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
