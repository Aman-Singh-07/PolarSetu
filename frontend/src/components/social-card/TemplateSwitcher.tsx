import React from 'react';
import type { CardTemplate } from '../../types';

interface TemplateOption {
  id: CardTemplate;
  label: string;
  sublabel: string;
  ratioClass: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: '1:1',
    label: '1:1 Square',
    sublabel: 'Instagram, Feed (1080×1080)',
    ratioClass: 'w-6 h-6',
  },
  {
    id: '16:9',
    label: '16:9 Landscape',
    sublabel: 'Twitter, LinkedIn (1920×1080)',
    ratioClass: 'w-8 h-4.5',
  },
  {
    id: '9:16',
    label: '9:16 Story',
    sublabel: 'Stories, Reels (1080×1920)',
    ratioClass: 'w-4.5 h-8',
  },
];

interface TemplateSwitcherProps {
  selected: CardTemplate;
  onChange: (template: CardTemplate) => void;
  disabled?: boolean;
}

export const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({
  selected,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Card Template Aspect Ratio">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selected === tmpl.id;
          return (
            <button
              key={tmpl.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(tmpl.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-deep-ocean text-white border-cyan-accent shadow-soft ring-1 ring-cyan-accent'
                  : 'bg-white border-border-ice text-ink hover:border-cyan-accent/50 hover:bg-frost/40'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Visual aspect ratio miniature preview */}
              <div className="h-10 flex items-center justify-center mb-2">
                <div
                  className={`rounded-sm border-2 ${
                    isSelected ? 'border-cyan-accent bg-cyan-accent/20' : 'border-muted/50 bg-frost'
                  } ${tmpl.ratioClass}`}
                />
              </div>
              <span className="text-xs font-bold leading-tight">{tmpl.label}</span>
              <span className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-white/70' : 'text-muted'}`}>
                {tmpl.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSwitcher;
