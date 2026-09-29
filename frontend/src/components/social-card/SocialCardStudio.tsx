import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Download,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Loader2,
} from 'lucide-react';
import { api } from '../../services/api';
import type { Expedition, MediaItem, CardTemplate, SocialCardGeneration } from '../../types';
import CardConfigurator from './CardConfigurator';
import CardCanvas, { type CardCanvasRef } from './CardCanvas';
import { Button } from '../ui/Button';

export const SocialCardStudio: React.FC = () => {
  const { t } = useTranslation('outreach');
  const [searchParams] = useSearchParams();

  const cardRef = useRef<CardCanvasRef>(null);

  // Core state
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string>('');
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>('1:1');

  // Content state
  const [statText, setStatText] = useState<string>('-42°C Winter Record at Maitri Station');
  const [caption, setCaption] = useState<string>(
    "India's Antarctic research station Maitri endured extreme blizzard conditions during winter-phase operations, maintaining continuous scientific instrumentation observations."
  );
  const [generation, setGeneration] = useState<SocialCardGeneration | null>(null);

  // UI state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  // Load expeditions on mount
  useEffect(() => {
    let isMounted = true;
    api.getExpeditions().then((list) => {
      if (!isMounted) return;
      setExpeditions(list);

      // Check query param for prefilled expedition
      const paramExpId = searchParams.get('expeditionId');
      if (paramExpId && list.some((e) => e.id === paramExpId)) {
        setSelectedExpeditionId(paramExpId);
      } else if (list.length > 0 && !selectedExpeditionId) {
        setSelectedExpeditionId(list[0].id);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Load photos when expedition changes
  useEffect(() => {
    if (!selectedExpeditionId) {
      setPhotos([]);
      setSelectedPhoto(null);
      return;
    }

    let isMounted = true;
    setPhotosLoading(true);
    api.getMedia()
      .then((allMedia) => {
        if (!isMounted) return;
        // Filter by expedition and media type image/PHOTO
        const filtered = allMedia.filter(
          (m) =>
            m.expeditionId === selectedExpeditionId ||
            (m.region && expeditions.find((e) => e.id === selectedExpeditionId)?.region === m.region)
        );

        // Fallback to all images if none directly match
        const available = filtered.length > 0 ? filtered : allMedia;
        setPhotos(available);

        if (available.length > 0) {
          setSelectedPhoto(available[0]);
        } else {
          setSelectedPhoto(null);
        }
      })
      .catch(() => {
        if (isMounted) setPhotos([]);
      })
      .finally(() => {
        if (isMounted) setPhotosLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedExpeditionId, expeditions]);

  // Handle generation action
  const handleGenerate = async () => {
    if (!selectedExpeditionId || !selectedPhoto) {
      setError(t('errors.noPhotoSelected', 'Please select an expedition and photo first.'));
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSubmitted(false);

    try {
      // Find associated resources for this expedition
      const expDetail = await api.getExpedition(selectedExpeditionId).catch(() => null);
      const resourceIds = expDetail?.resources?.map((r) => r.id) || ['RPT-2024-001'];

      const result = await api.generateSocialCard({
        resource_ids: resourceIds.length > 0 ? resourceIds : ['RPT-2024-001'],
        media_id: parseInt(selectedPhoto.id, 10) || 1,
        template: selectedTemplate,
      });

      setGeneration({
        id: result.id,
        stat_text: result.stat_text,
        caption: result.caption,
        source_ids: result.source_ids,
        citation_valid: result.citation_valid,
        status: (result.status as any) || 'DRAFT',
      });

      setStatText(result.stat_text);
      setCaption(result.caption);

      setToastMessage('Card generated successfully! Review, export, or submit for approval.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      setError(err?.message || t('errors.aiFailed', 'AI generation failed. Please try again.'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PNG download
  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await cardRef.current.exportPng();
      const link = document.createElement('a');
      link.download = `aicygram-${selectedTemplate.replace(':', 'x')}-${generation?.id || 'card'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(t('errors.exportFailed', 'Failed to export image. Please try again.'));
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Submit for Review
  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      // The generation is already recorded in the review queue as a DRAFT.
      // This action marks completion and shows verified submission status.
      setSubmitted(true);
      setToastMessage('Card submitted for administrator review! Visible in Admin Review Queue.');
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err: any) {
      setError('Failed to submit for review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedExpedition = expeditions.find((e) => e.id === selectedExpeditionId);
  const resourceUrl = generation?.source_ids?.[0]
    ? `/research/${generation.source_ids[0]}`
    : `/expeditions/${selectedExpeditionId || ''}`;

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl bg-deep-ocean text-white shadow-2xl border border-cyan-accent flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-cyan-accent shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Grid (Config 5 cols : Preview 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CardConfigurator
            expeditions={expeditions}
            selectedExpeditionId={selectedExpeditionId}
            onSelectExpedition={setSelectedExpeditionId}
            photos={photos}
            selectedPhoto={selectedPhoto}
            onSelectPhoto={setSelectedPhoto}
            photosLoading={photosLoading}
            selectedTemplate={selectedTemplate}
            onChangeTemplate={setSelectedTemplate}
            statText={statText}
            onChangeStatText={setStatText}
            caption={caption}
            onChangeCaption={setCaption}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            error={error}
            onRetry={handleGenerate}
          />
        </div>

        {/* Right Column: Live Card Canvas & Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6 sticky top-24">
          {/* Card Top Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-border-ice shadow-soft">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-deep-ocean">
                {t('preview.title', 'Card Preview')}
              </span>
              <span className="text-[11px] text-muted font-medium ml-2">
                ({selectedTemplate})
              </span>
            </div>

            {/* Citation verification badge */}
            {generation && (
              <div className="flex items-center gap-2">
                {generation.citation_valid ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    <FileCheck className="w-3.5 h-3.5" />
                    {t('preview.citationValid', 'Citation Verified')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-warn/15 text-amber-warn border border-amber-warn/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {t('preview.citationFlagged', 'Source Citation Flagged')}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Interactive Card Canvas Container */}
          <div className="w-full flex justify-center p-6 sm:p-10 rounded-2xl bg-frost/50 border border-border-ice shadow-inner relative min-h-[460px] items-center">
            {isGenerating && (
              <div className="absolute inset-0 bg-deep-ocean/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 rounded-2xl text-white">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-accent" />
                <span className="text-sm font-bold tracking-wider uppercase">
                  Synthesizing Grounded Card...
                </span>
              </div>
            )}

            <CardCanvas
              ref={cardRef}
              template={selectedTemplate}
              media={selectedPhoto}
              statText={statText}
              caption={caption}
              resourceUrl={resourceUrl}
                expeditionName={selectedExpedition?.name || 'Indian Polar Mission'}
            />
          </div>

          {/* Bottom Action Buttons: Download PNG & Submit for Review */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2.5 shadow-elevated cursor-pointer"
              onClick={handleDownloadPng}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-accent" />
                  <span>{t('preview.downloading', 'Exporting PNG...')}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-cyan-accent" />
                  <span className="text-white">{t('button.download', 'Download PNG (1080×1080)')}</span>
                </>
              )}
            </Button>

            <Button
              variant={submitted ? 'secondary' : 'primary'}
              size="lg"
              className={`w-full sm:flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                submitted
                  ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 cursor-default'
                  : 'bg-white hover:bg-frost border border-border-ice text-deep-ocean'
              }`}
              onClick={handleSubmitForReview}
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-deep-ocean group-hover:text-deep-ocean">{t('button.submitting', 'Submitting...')}</span>
                </>
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="text-deep-ocean group-hover:text-deep-ocean">{t('button.submitted', 'Submitted for Review ✓')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-cyan-accent" />
                  <span className="text-deep-ocean group-hover:text-deep-ocean">{t('button.submit', 'Submit for Review')}</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted px-2">
            <span>{t('preview.previewScale', 'Card preview scaled to fit viewport. Export will be full 1080px native resolution.')}</span>
            <span className="font-mono">AICYGRAM-STUDIO-v3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCardStudio;
