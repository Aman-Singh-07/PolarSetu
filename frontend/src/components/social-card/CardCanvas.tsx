import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { toPng } from 'html-to-image';
import { AlertTriangle, MapPin } from 'lucide-react';
import type { CardTemplate, MediaItem } from '../../types';
import { TEMPLATE_CONFIGS } from './CardTemplates';
import QRCodeWidget from './QRCodeWidget';

export interface CardCanvasRef {
  exportPng: () => Promise<string>;
  getElement: () => HTMLDivElement | null;
}

interface CardCanvasProps {
  template: CardTemplate;
  media: MediaItem | null;
  statText: string;
  caption: string;
  resourceUrl: string;
  lang?: string;
  expeditionName?: string;
  onImageError?: () => void;
  className?: string;
}

export const CardCanvas = forwardRef<CardCanvasRef, CardCanvasProps>(({
  template,
  media,
  statText,
  caption,
  resourceUrl,
  lang: _lang = 'en',
  expeditionName = 'National Polar Research Expedition',
  onImageError,
  className = '',
}, ref) => {
  const cardElementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  const config = TEMPLATE_CONFIGS[template] || TEMPLATE_CONFIGS['1:1'];

  // Reset imgFailed when media changes
  useEffect(() => {
    setImgFailed(false);
  }, [media?.id, media?.sourceUrl, media?.thumbnailUrl]);

  // Dynamically compute scale factor using ResizeObserver to handle CSS transitions
  useEffect(() => {
    const updateScale = (width: number) => {
      const newScale = width / config.width;
      setScale(newScale);
    };

    if (!containerRef.current) return;

    // Initial scale
    updateScale(containerRef.current.clientWidth);

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Use borderBoxSize if available for better accuracy, else fallback to contentRect
        const width = entry.contentRect.width;
        if (width > 0) {
          updateScale(width);
        }
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [config.width]);

  // Expose export function to parent via ref
  useImperativeHandle(ref, () => ({
    exportPng: async () => {
      if (!cardElementRef.current) {
        throw new Error('Card element not rendered');
      }

      // Ensure all web fonts are fully loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Small pause to allow layout settled
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardElementRef.current, {
        cacheBust: true,
        pixelRatio: 1, // Card is already 1080x1080 (or 1920x1080) in CSS pixels
        width: config.width,
        height: config.height,
        style: { transform: 'scale(1)' },
      });

      return dataUrl;
    },
    getElement: () => cardElementRef.current,
  }));

  const imageUrl = media?.thumbnailUrl || media?.sourceUrl || '';
  const hasValidImage = !!imageUrl && !imgFailed;

  const fullResourceUrl = resourceUrl.startsWith('http')
    ? resourceUrl
    : `${window.location.origin}${resourceUrl.startsWith('/') ? '' : '/'}${resourceUrl}`;

  const brandingTitle = 'Aicygram';
  const brandingSub = 'MoES · NCPOR · India';

  // Template specific layout styles
  const isLandscape = template === '16:9';
  const isVertical = template === '9:16';

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* Fallback warning if image failed */}
      {imgFailed && (
        <div className="mb-3 px-3 py-1.5 rounded-lg bg-amber-warn/15 border border-amber-warn/30 text-amber-warn text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Photo unavailable — using branded gradient fallback</span>
        </div>
      )}

      {/* Outer Scaled Preview Container */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-deep-ocean transition-all duration-300"
        style={{
          maxWidth: `${config.maxPreviewWidth}px`,
          height: `${config.height * scale}px`,
        }}
        role="img"
        aria-label={`Polar Social Card: ${statText}. ${caption}`}
      >
        {/* Real Native Resolution Canvas (1080x1080 / 1920x1080) */}
        <div
          ref={cardElementRef}
          style={{
            width: `${config.width}px`,
            height: `${config.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className={`relative overflow-hidden select-none bg-deep-ocean flex flex-col justify-between`}
        >
          {/* Background Layer (Image or Gradient Fallback) */}
          {hasValidImage ? (
            <img
              src={imageUrl}
              alt={media?.caption || 'Polar Expedition Scene'}
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => {
                setImgFailed(true);
                if (onImageError) onImageError();
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#071426] via-[#0D2847] to-[#123E6B]">
              {/* Polar Ice Crystal Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 25px 25px, rgba(56, 189, 248, 0.4) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(248, 251, 253, 0.3) 2%, transparent 0%)`,
                  backgroundSize: '100px 100px',
                }}
              />
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-accent/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-glacial-blue/10 blur-3xl pointer-events-none" />
            </div>
          )}

          {/* Dark Contrast Gradient Overlay (Bottom 65% of card) */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-ocean via-deep-ocean/80 via-40% to-transparent pointer-events-none" />

          {/* Top Header Strip / Watermark Badge */}
          <div className="relative z-10 p-10 flex items-center justify-between">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-deep-ocean/70 backdrop-blur-md border border-white/15 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-widest text-snow/90">
                {expeditionName}
              </span>
            </div>

            {media?.location && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-snow/80">
                <MapPin className="w-3.5 h-3.5 text-cyan-accent" />
                <span>{media.location}</span>
              </div>
            )}
          </div>

          {/* Center / Lower Content Section */}
          <div className={`relative z-10 px-12 pb-6 flex flex-col ${isLandscape ? 'max-w-[70%]' : 'w-full'}`}>
            {/* Stat Headline */}
            <div className="mb-4">
              <h2
                className={`font-black text-snow tracking-tight break-words leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${
                  isVertical ? 'text-6xl' : 'text-6xl'
                }`}
                style={{
                  textShadow: '0 3px 14px rgba(7, 20, 38, 0.95)',
                  wordBreak: 'break-word',
                }}
              >
                {statText || 'Polar Research Discovery'}
              </h2>
            </div>

            {/* Caption */}
            {caption && (
              <p
                className="text-snow/85 font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-3 text-2xl"
              >
                {caption}
              </p>
            )}

            {/* Media Attribution */}
            {media?.attribution && (
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-snow/60 flex items-center gap-1.5">
                <span>📷 Photo: {media.attribution}</span>
              </p>
            )}
          </div>

          {/* Bottom Branding & Verification Bar */}
          <div className="relative z-10 px-10 py-6 bg-deep-ocean/90 backdrop-blur-md border-t border-white/15 flex items-center justify-between">
            {/* Branding Logos & Title */}
            <div className="flex items-center gap-4">
              <img
                src="/branding/aicygram-logo.png"
                alt="Aicygram Logo"
                className="w-14 h-14 object-contain rounded-xl p-1 bg-white/10 border border-white/20 shadow-md"
                onError={(e) => {
                  // Fallback icon if logo png missing
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span
                  className="text-2xl font-black tracking-tight text-snow leading-none flex items-center gap-2"
                  
                >
                  {brandingTitle}
                  <span className="text-cyan-accent text-sm font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-accent/15 border border-cyan-accent/30">
                    Official
                  </span>
                </span>
                <span className="text-xs font-semibold text-snow/70 tracking-widest uppercase mt-1">
                  {brandingSub}
                </span>
              </div>
            </div>

            {/* Verification QR Code */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:flex flex-col">
                <span className="text-xs font-bold text-snow uppercase tracking-wider">
                  Verified Data
                </span>
                <span className="text-[10px] text-cyan-accent/80 font-mono tracking-tight">
                  aicygram.in
                </span>
              </div>
              <QRCodeWidget
                value={fullResourceUrl}
                size={80}
                className="border border-white/20 bg-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CardCanvas.displayName = 'CardCanvas';

export default CardCanvas;
