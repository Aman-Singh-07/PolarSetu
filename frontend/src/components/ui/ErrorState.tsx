import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation('common');
  const displayTitle = title || t('state.error.title');

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-error" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-deep-ocean mb-2 font-display">{displayTitle}</h3>
      <p className="text-sm text-error/80 font-medium max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('button.retry')}
        </Button>
      )}
    </div>
  );
}
