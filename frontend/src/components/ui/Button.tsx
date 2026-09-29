import { forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent focus-visible:ring-offset-2 disabled:bg-border-ice disabled:text-muted disabled:border-transparent disabled:opacity-100 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-deep-ocean text-white hover:bg-ocean-navy hover:-translate-y-[1px]",
      secondary: "bg-transparent border border-border-ice text-ink hover:bg-ice-blue",
      tertiary: "bg-transparent text-glacial-blue hover:text-ocean-navy !p-0 !h-auto",
      ghost: "bg-transparent text-muted hover:text-ink hover:bg-black/5",
      danger: "bg-error/10 text-error hover:bg-error/20",
    };

    const sizes = {
      sm: "h-[36px] px-3 text-xs rounded-[8px]",
      md: "h-[44px] px-[20px] text-[14px] rounded-[10px]",
      lg: "h-[52px] px-6 text-[15px] rounded-[12px]",
      icon: "h-[40px] w-[40px] rounded-[10px] p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 current-color" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
