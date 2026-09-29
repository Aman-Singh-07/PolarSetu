import { Search } from 'lucide-react';
import clsx from 'clsx';
import { Input, type InputProps } from './Input';

export interface SearchBarProps extends InputProps {
  onSearch?: (query: string) => void;
  wrapperClassName?: string;
}

export function SearchBar({ className, wrapperClassName, onChange, value, ...props }: SearchBarProps) {
  return (
    <div className={clsx("relative flex items-center w-full", wrapperClassName)}>
      <Search className="absolute left-4 w-5 h-5 text-muted pointer-events-none" />
      <Input
        type="text"
        className={clsx("pl-11 h-[52px]", className)}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
