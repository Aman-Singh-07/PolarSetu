import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, BookOpen, Check, Tag } from 'lucide-react';
import type { CurriculumConcept } from '../../types';

interface ConceptPickerProps {
  concepts: CurriculumConcept[];
  selectedConcept: CurriculumConcept | null;
  onSelectConcept: (concept: CurriculumConcept) => void;
  loading?: boolean;
}

export function ConceptPicker({
  concepts,
  selectedConcept,
  onSelectConcept,
  loading = false,
}: ConceptPickerProps) {
  const { t } = useTranslation('lesson-plans');
  const [search, setSearch] = useState('');

  const filteredConcepts = useMemo(() => {
    if (!search.trim()) return concepts;
    const query = search.toLowerCase();
    return concepts.filter(c =>
      c.concept.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.nepTags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [concepts, search]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('searchConcepts', 'Search NCERT concepts or NEP tags...')}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-ice rounded-xl text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent transition-all shadow-soft"
          aria-label={t('conceptLabel', 'Select Curriculum Concept')}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink px-1.5 py-0.5 rounded bg-frost"
          >
            Clear
          </button>
        )}
      </div>

      {/* List of Concepts */}
      {loading ? (
        <div className="p-8 text-center text-sm text-muted bg-white/50 border border-border-ice rounded-xl">
          <div className="w-6 h-6 border-2 border-border-ice border-t-cyan-accent rounded-full animate-spin mx-auto mb-2" />
          <span>{t('generatingPlan', 'Loading curriculum concepts...')}</span>
        </div>
      ) : filteredConcepts.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted bg-white border border-border-ice rounded-xl">
          <BookOpen className="w-8 h-8 text-muted/40 mx-auto mb-2" />
          <p className="font-medium text-deep-ocean">{t('noConcepts', 'No concepts match your search.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredConcepts.map(c => {
            const isSelected = selectedConcept?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectConcept(c)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-ice-blue/40 border-cyan-accent shadow-soft ring-1 ring-cyan-accent'
                    : 'bg-white border-border-ice hover:border-cyan-accent/50 hover:bg-snow/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-deep-ocean">
                      {c.concept}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-frost text-muted border border-border-ice/60">
                      Class {c.class} · {c.subject}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-cyan-accent text-deep-ocean flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                </div>

                {c.description && (
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {c.description}
                  </p>
                )}

                {c.nepTags && c.nepTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <Tag className="w-3 h-3 text-muted/70 shrink-0" />
                    {c.nepTags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-border-ice text-deep-ocean/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
