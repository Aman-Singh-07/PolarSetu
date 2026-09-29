import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-frost flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-deep-ocean mb-2 font-display">{title}</h3>
      <p className="text-sm text-muted font-light max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
