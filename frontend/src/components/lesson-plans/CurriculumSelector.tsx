import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, CheckSquare, Square, ExternalLink } from 'lucide-react';
import type { CurriculumConcept, Resource } from '../../types';
import { ConceptPicker } from './ConceptPicker';
import { Button } from '../ui/Button';

const CLASSES = [8, 9, 10, 11, 12];
const SUBJECTS = ['Science', 'Geography', 'Biology', 'Environmental Science'];

interface CurriculumSelectorProps {
  selectedClass: number;
  onSelectClass: (c: number) => void;
  selectedSubject: string;
  onSelectSubject: (s: string) => void;
  concepts: CurriculumConcept[];
  selectedConcept: CurriculumConcept | null;
  onSelectConcept: (c: CurriculumConcept) => void;
  conceptResources: Resource[];
  selectedResourceIds: string[];
  onToggleResourceId: (id: string) => void;
  onSelectAllResources: () => void;
  language?: string;
  onChangeLanguage?: (lang: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  conceptsLoading: boolean;
  resourcesLoading: boolean;
}

export function CurriculumSelector({
  selectedClass,
  onSelectClass,
  selectedSubject,
  onSelectSubject,
  concepts,
  selectedConcept,
  onSelectConcept,
  conceptResources,
  selectedResourceIds,
  onToggleResourceId,
  onSelectAllResources,
  language: _language = 'en',
  onChangeLanguage: _onChangeLanguage,
  onGenerate,
  isGenerating,
  conceptsLoading,
  resourcesLoading,
}: CurriculumSelectorProps) {
  const { t } = useTranslation('lesson-plans');

  const canGenerate = selectedConcept && selectedResourceIds.length > 0 && !isGenerating;

  return (
    <div className="w-full flex flex-col gap-8 bg-white border border-border-ice rounded-2xl p-6 lg:p-8 shadow-soft">
      {/* ─── STEP 1: CLASS & SUBJECT ─── */}
      <div className="flex flex-col gap-5">
        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2.5">
            1. {t('classLabel', 'Select Class')}
          </span>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Class Selection">
            {CLASSES.map(cls => {
              const active = selectedClass === cls;
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => onSelectClass(cls)}
                  className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-cyan-accent border-cyan-accent text-deep-ocean shadow-soft font-bold scale-[1.02]'
                      : 'bg-white border-border-ice text-ink hover:border-cyan-accent/50 hover:shadow-soft'
                  }`}
                  aria-checked={active}
                  role="radio"
                >
                  Class {cls}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2.5">
            2. {t('subjectLabel', 'Select Subject')}
          </span>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Subject Selection">
            {SUBJECTS.map(subj => {
              const active = selectedSubject === subj;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => onSelectSubject(subj)}
                  className={`px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-deep-ocean border-deep-ocean text-white shadow-soft font-bold'
                      : 'bg-white border-border-ice text-ink hover:border-deep-ocean/40 hover:bg-frost'
                  }`}
                  aria-checked={active}
                  role="radio"
                >
                  {subj}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-px bg-border-ice" />

      {/* ─── STEP 2: CONCEPT PICKER ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
            3. {t('conceptLabel', 'Curriculum Concept')}
          </span>
          {selectedConcept && (
            <span className="text-xs font-semibold text-cyan-accent bg-cyan-accent/10 px-2.5 py-0.5 rounded-full">
              Selected: {selectedConcept.concept}
            </span>
          )}
        </div>
        <ConceptPicker
          concepts={concepts}
          selectedConcept={selectedConcept}
          onSelectConcept={onSelectConcept}
          loading={conceptsLoading}
        />
      </div>

      <div className="h-px bg-border-ice" />

      {/* ─── STEP 3: SOURCE RESOURCES ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
            4. {t('resourcesLabel', 'Source Research Material')}
          </span>
          {conceptResources.length > 0 && (
            <button
              type="button"
              onClick={onSelectAllResources}
              className="text-xs text-glacial-blue hover:text-deep-ocean font-semibold transition-colors"
            >
              {selectedResourceIds.length === conceptResources.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {resourcesLoading ? (
          <div className="p-6 text-center text-xs text-muted bg-snow rounded-xl border border-border-ice">
            <div className="w-5 h-5 border-2 border-border-ice border-t-cyan-accent rounded-full animate-spin mx-auto mb-2" />
            Loading linked research resources...
          </div>
        ) : conceptResources.length === 0 ? (
          <div className="p-5 bg-frost/50 border border-border-ice rounded-xl text-center flex flex-col items-center gap-2">
            <FileText className="w-6 h-6 text-muted/60" />
            <p className="text-xs text-muted max-w-md">
              {t('noResourcesTagged', 'No pre-tagged resources for this concept. You can link research material in the explore section.')}
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-accent hover:underline mt-1"
              target="_blank"
            >
              {t('exploreRepository', 'Explore Polar Repository')} <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {conceptResources.map(res => {
              const isChecked = selectedResourceIds.includes(res.id);
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onToggleResourceId(res.id)}
                  className={`text-left p-3 rounded-xl border transition-all duration-150 flex items-start gap-2.5 cursor-pointer ${
                    isChecked
                      ? 'bg-ice-blue/30 border-cyan-accent shadow-xs'
                      : 'bg-white border-border-ice hover:bg-snow'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-deep-ocean">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-cyan-accent fill-cyan-accent/20" />
                    ) : (
                      <Square className="w-4 h-4 text-muted/50" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-deep-ocean truncate">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-muted font-mono">
                      {res.id} · {res.region} · {res.year}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-px bg-border-ice" />

      {/* ─── GENERATION CTA ─── */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onGenerate}
          disabled={!canGenerate}
          isLoading={isGenerating}
          className="w-full sm:w-auto shadow-elevated"
        >
          <Sparkles className="w-4 h-4 mr-2 text-cyan-accent" />
          {isGenerating ? t('generatingPlan', 'Crafting your lesson plan...') : t('generatePlan', 'Generate Lesson Plan')}
        </Button>
      </div>
    </div>
  );
}
