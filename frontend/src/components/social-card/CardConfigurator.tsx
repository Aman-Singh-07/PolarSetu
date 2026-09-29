import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import type { Expedition, MediaItem, CardTemplate } from '../../types';
import TemplateSwitcher from './TemplateSwitcher';
import PhotoPicker from './PhotoPicker';

interface CardConfiguratorProps {
  expeditions: Expedition[];
  selectedExpeditionId: string;
  onSelectExpedition: (id: string) => void;
  photos: MediaItem[];
  selectedPhoto: MediaItem | null;
  onSelectPhoto: (photo: MediaItem) => void;
  photosLoading: boolean;
  selectedTemplate: CardTemplate;
  onChangeTemplate: (template: CardTemplate) => void;
  lang?: string;
  onChangeLang?: (lang: string) => void;
  statText: string;
  onChangeStatText: (val: string) => void;
  caption: string;
  onChangeCaption: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const CardConfigurator: React.FC<CardConfiguratorProps> = ({
  expeditions,
  selectedExpeditionId,
  onSelectExpedition,
  photos,
  selectedPhoto,
  onSelectPhoto,
  photosLoading,
  selectedTemplate,
  onChangeTemplate,
  lang: _lang = 'en',
  onChangeLang: _onChangeLang,
  statText,
  onChangeStatText,
  caption,
  onChangeCaption,
  onGenerate,
  isGenerating,
  error,
  onRetry,
}) => {
  const { t } = useTranslation('outreach');

  // Count words in statText to guide user
  const statWords = statText.trim().length > 0 ? statText.trim().split(/\s+/).length : 0;
  const isStatTooLong = statWords > 15;

  const canGenerate = !!selectedExpeditionId && !!selectedPhoto && !isGenerating;

  return (
    <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-border-ice shadow-soft">
      {/* 1. Expedition Selector */}
      <div className="flex flex-col gap-2.5">
        <label
          htmlFor="expedition-select"
          className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2"
        >
          {t('config.selectExpedition', 'Select Expedition')}
        </label>
        <select
          id="expedition-select"
          value={selectedExpeditionId}
          disabled={isGenerating}
          onChange={(e) => onSelectExpedition(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border-ice bg-white text-ink font-medium text-sm focus:outline-none focus:ring-2 focus:ring-cyan-accent focus:border-transparent transition-all"
        >
          <option value="">{t('config.chooseExpedition', 'Choose an expedition...')}</option>
          {expeditions.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.name} ({exp.year}) — {exp.region}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Photo Picker */}
      <div className={`flex flex-col gap-2.5 ${!selectedExpeditionId ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between border-b border-border-ice pb-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest">
            {t('config.selectPhoto', 'Select Expedition Photo')}
          </label>
          <span className="text-[11px] text-muted font-medium">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
        <PhotoPicker
          photos={photos}
          selectedId={selectedPhoto?.id || null}
          onSelect={onSelectPhoto}
          loading={photosLoading}
          disabled={isGenerating}
        />
      </div>

      {/* 3. Template Switcher */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">
          {t('config.selectTemplate', 'Card Aspect Ratio')}
        </label>
        <TemplateSwitcher
          selected={selectedTemplate}
          onChange={onChangeTemplate}
          disabled={isGenerating}
        />
      </div>

            {/* 4. Stat Headline Override */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-border-ice pb-2">
          <label htmlFor="stat-input" className="text-[10px] font-bold text-muted uppercase tracking-widest">
            {t('config.statOverride', 'Key Statistic / Headline')}
          </label>
          <span
            className={`text-[10px] font-bold ${
              isStatTooLong ? 'text-amber-warn' : 'text-muted'
            }`}
          >
            {statWords}/15 words
          </span>
        </div>
        <input
          id="stat-input"
          type="text"
          value={statText}
          disabled={isGenerating}
          onChange={(e) => onChangeStatText(e.target.value)}
          placeholder="e.g. -42°C Winter Record at Maitri Station"
          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
            isStatTooLong
              ? 'border-amber-warn/60 focus:ring-2 focus:ring-amber-warn bg-amber-warn/5'
              : 'border-border-ice focus:ring-2 focus:ring-cyan-accent focus:border-transparent bg-white'
          }`}
        />
        {isStatTooLong && (
          <p className="text-[11px] text-amber-warn font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Headline is longer than recommended 15 words. Consider shortening for optimal card layout.
          </p>
        )}
      </div>

      {/* 6. Caption Override */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="caption-input" className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border-ice pb-2">
          {t('config.captionOverride', 'Outreach Caption')}
        </label>
        <textarea
          id="caption-input"
          rows={3}
          value={caption}
          disabled={isGenerating}
          onChange={(e) => onChangeCaption(e.target.value)}
          placeholder="Engaging 2-3 sentence outreach summary explaining the statistic for the public..."
          className="w-full px-4 py-3 rounded-xl border border-border-ice text-sm font-light leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-cyan-accent focus:border-transparent transition-all resize-y"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-2.5 py-1 rounded bg-error text-white hover:bg-error/90 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          )}
        </div>
      )}

      {/* Generate Action Button */}
      <button
        type="button"
        disabled={!canGenerate}
        onClick={onGenerate}
        className="w-full py-4 bg-deep-ocean hover:bg-ocean-navy disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-elevated flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-cyan-accent" />
            <span>{t('config.generatingCard', 'Generating Card...')}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-cyan-accent" />
            <span>{t('config.generateCard', 'Generate Card')}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CardConfigurator;
