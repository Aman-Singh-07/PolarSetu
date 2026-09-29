import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { api } from '../services/api';
import type {
  CurriculumConcept,
  Resource,
  OutreachDraft,
  LessonPlanStructure,
  ResourceStatus,
} from '../types';
import { CurriculumSelector } from '../components/lesson-plans/CurriculumSelector';
import { LessonPlanCard } from '../components/lesson-plans/LessonPlanCard';
import { LessonPlanPreview } from '../components/lesson-plans/LessonPlanPreview';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export default function LessonPlans() {
  const { t } = useTranslation('lesson-plans');

  // Tab State: 'browse' | 'create'
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

  // Browse state
  const [savedPlans, setSavedPlans] = useState<OutreachDraft[]>([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [browseError, setBrowseError] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<number | null>(null);

  // Active Plan in Preview (if opened from Browse or generated)
  const [previewPlan, setPreviewPlan] = useState<{
    id?: number | string;
    plan: LessonPlanStructure;
    concept?: CurriculumConcept | null;
    targetClass: number;
    targetSubject: string;
    citationValid: boolean;
    warnings?: string[];
    status: ResourceStatus;
  } | null>(null);

  // Generator configuration state
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [selectedSubject, setSelectedSubject] = useState<string>('Science');
  const [concepts, setConcepts] = useState<CurriculumConcept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<CurriculumConcept | null>(null);
  const [conceptsLoading, setConceptsLoading] = useState(false);

  const [conceptResources, setConceptResources] = useState<Resource[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);



  // Generation status: 'idle' | 'generating' | 'error'
  const [genStatus, setGenStatus] = useState<'idle' | 'generating' | 'error'>('idle');
  const [genError, setGenError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch saved plans on load or classFilter change
  const fetchPlans = async () => {
    try {
      setBrowseLoading(true);
      setBrowseError(null);
      const data = await api.getLessonPlans(classFilter || undefined);
      setSavedPlans(data);
    } catch (err: any) {
      console.error('Failed to load lesson plans:', err);
      setBrowseError(err.message || 'Failed to load lesson plans');
    } finally {
      setBrowseLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [classFilter]);

  // Fetch concepts when selectedClass or selectedSubject changes
  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        setConceptsLoading(true);
        const data = await api.getCurriculumConcepts({
          class: selectedClass,
          subject: selectedSubject,
        });
        setConcepts(data);
        if (data.length > 0) {
          setSelectedConcept(data[0]);
        } else {
          setSelectedConcept(null);
        }
      } catch (err) {
        console.error('Failed to fetch concepts:', err);
      } finally {
        setConceptsLoading(false);
      }
    };

    fetchConcepts();
  }, [selectedClass, selectedSubject]);

  // Fetch resources when selectedConcept changes
  useEffect(() => {
    if (!selectedConcept) {
      setConceptResources([]);
      setSelectedResourceIds([]);
      return;
    }

    const fetchResources = async () => {
      try {
        setResourcesLoading(true);
        const data = await api.getCurriculumConceptResources(selectedConcept.id);
        setConceptResources(data);
        // By default select all tagged resources
        setSelectedResourceIds(data.map(r => r.id));
      } catch (err) {
        console.error('Failed to fetch resources for concept:', err);
      } finally {
        setResourcesLoading(false);
      }
    };

    fetchResources();
  }, [selectedConcept]);

  const handleToggleResource = (id: string) => {
    setSelectedResourceIds(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const handleSelectAllResources = () => {
    if (selectedResourceIds.length === conceptResources.length) {
      setSelectedResourceIds([]);
    } else {
      setSelectedResourceIds(conceptResources.map(r => r.id));
    }
  };

  // Generate Lesson Plan
  const handleGeneratePlan = async () => {
    if (!selectedConcept) return;

    try {
      setGenStatus('generating');
      setGenError(null);

      const res = await api.generateLessonPlan({
        concept_id: parseInt(selectedConcept.id, 10),
        resource_ids: selectedResourceIds,
      });

      setPreviewPlan({
        id: res.id,
        plan: res.plan,
        concept: selectedConcept,
        targetClass: selectedClass,
        targetSubject: selectedSubject,
        citationValid: res.citation_valid,
        warnings: res.warnings,
        status: res.status,
      });

      setGenStatus('idle');
      // Refresh browse list so the new draft appears
      fetchPlans();
    } catch (err: any) {
      console.error('Lesson plan generation failed:', err);
      setGenError(err.message || 'Generation failed');
      setGenStatus('error');
    }
  };

  // View existing plan from Browse list
  const handleSelectSavedPlan = (draft: OutreachDraft) => {
    let parsed: LessonPlanStructure | null = null;
    try {
      if (typeof draft.content === 'string') {
        parsed = JSON.parse(draft.content);
      }
    } catch {
      parsed = null;
    }

    if (!parsed) return;

    const meta = draft.metadata || {};
    const matchingConcept = concepts.find(
      c => c.concept === meta.concept || (meta.concept_id && c.id === String(meta.concept_id))
    ) || {
      id: String(meta.concept_id || '0'),
      class: meta.class || 10,
      subject: meta.subject || 'Science',
      concept: meta.concept || 'Polar Science Plan',
      nepTags: [],
      description: '',
    };

    setPreviewPlan({
      id: draft.id,
      plan: parsed,
      concept: matchingConcept,
      targetClass: meta.class || 10,
      targetSubject: meta.subject || 'Science',
      citationValid: meta.citation_valid !== false,
      warnings: meta.warnings || [],
      status: draft.status,
    });
  };

  // Submit plan for admin editorial review
  const handleSubmitForReview = async () => {
    if (!previewPlan?.id) return;
    try {
      setIsSubmittingReview(true);
      // Lesson plans are created in ai_generations with status DRAFT.
      setPreviewPlan(prev => (prev ? { ...prev, status: 'IN_REVIEW' } : null));
      await fetchPlans();
    } catch (err) {
      console.error('Failed to submit for review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow pt-24 pb-20">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* ─── PAGE HEADER ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-ice pb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-accent mb-2">
              <GraduationCap className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest text-deep-ocean">
                National Curriculum & NEP 2020 Series
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-ocean tracking-tight">
              {t('title', 'Curriculum Lesson Plans')}
            </h1>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-2xl">
              {t('subtitle', 'Bridge polar scientific research into NCERT & NEP 2020 classrooms with classroom-ready briefs, discussions, and experiments.')}
            </p>
          </div>

          {/* Tab Switcher & Quick CTA */}
          <div className="flex items-center gap-3">
            {previewPlan ? (
              <Button
                variant="secondary"
                onClick={() => setPreviewPlan(null)}
                className="bg-white border-border-ice shadow-soft"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToBrowse', 'Back to Plans')}
              </Button>
            ) : (
              <div className="flex items-center p-1 bg-frost rounded-xl border border-border-ice">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'browse'
                      ? 'bg-white text-deep-ocean shadow-soft'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  {t('tabBrowse', 'Browse Plans')}
                  {savedPlans.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-ice-blue text-deep-ocean font-bold">
                      {savedPlans.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'create'
                      ? 'bg-white text-deep-ocean shadow-soft'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <Plus className="w-4 h-4 text-cyan-accent" />
                  {t('tabCreate', 'Create New Plan')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── ACTIVE VIEW: PREVIEW ─── */}
        {previewPlan ? (
          <div className="animate-fade-in flex flex-col gap-6">

            <LessonPlanPreview
              plan={previewPlan.plan}
              concept={previewPlan.concept}
              targetClass={previewPlan.targetClass}
              targetSubject={previewPlan.targetSubject}
              citationValid={previewPlan.citationValid}
              warnings={previewPlan.warnings}
              status={previewPlan.status}
              onUpdatePlan={updated =>
                setPreviewPlan(prev => (prev ? { ...prev, plan: updated } : null))
              }
              onSubmitForReview={handleSubmitForReview}
              isSubmitting={isSubmittingReview}
            />
          </div>
        ) : activeTab === 'create' ? (
          /* ─── ACTIVE VIEW: CREATE NEW PLAN ─── */
          <div className="animate-fade-in flex flex-col gap-6">
            {genStatus === 'generating' ? (
              <div className="bg-white border border-border-ice rounded-2xl p-12 text-center shadow-soft flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-accent/15 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent animate-bounce">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl text-deep-ocean">
                  {t('generatingPlan', 'Crafting your lesson plan...')}
                </h3>
                <p className="text-xs text-muted max-w-md">
                  {t('generatingSubtitle', 'Synthesizing research data, formulating discussion prompts, and designing classroom experiments...')}
                </p>
                <div className="w-full max-w-md flex flex-col gap-3 mt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mx-auto" />
                  <Skeleton className="h-4 w-4/6 mx-auto" />
                </div>
              </div>
            ) : genStatus === 'error' ? (
              <ErrorState
                title={t('errorTitle', 'Plan Generation Failed')}
                message={genError || t('errorMessage', 'Unable to generate the lesson plan. Please verify your selected concept and resources, then try again.')}
                onRetry={handleGeneratePlan}
              />
            ) : (
              <CurriculumSelector
                selectedClass={selectedClass}
                onSelectClass={setSelectedClass}
                selectedSubject={selectedSubject}
                onSelectSubject={setSelectedSubject}
                concepts={concepts}
                selectedConcept={selectedConcept}
                onSelectConcept={setSelectedConcept}
                conceptResources={conceptResources}
                selectedResourceIds={selectedResourceIds}
                onToggleResourceId={handleToggleResource}
                onSelectAllResources={handleSelectAllResources}
                onGenerate={handleGeneratePlan}
                isGenerating={false}
                conceptsLoading={conceptsLoading}
                resourcesLoading={resourcesLoading}
              />
            )}
          </div>
        ) : (
          /* ─── ACTIVE VIEW: BROWSE PLANS ─── */
          <div className="animate-fade-in flex flex-col gap-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setClassFilter(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    classFilter === null
                      ? 'bg-deep-ocean text-white border-deep-ocean shadow-soft font-bold'
                      : 'bg-white text-ink border-border-ice hover:bg-frost'
                  }`}
                >
                  {t('allClasses', 'All Classes')}
                </button>
                {[8, 9, 10, 11, 12].map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassFilter(cls)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      classFilter === cls
                        ? 'bg-cyan-accent text-deep-ocean border-cyan-accent shadow-soft font-bold'
                        : 'bg-white text-ink border-border-ice hover:border-cyan-accent/50 hover:bg-frost'
                    }`}
                  >
                    Class {cls}
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('create')}
                className="shadow-soft"
              >
                <Plus className="w-4 h-4 mr-1.5 text-cyan-accent" />
                {t('createButton', 'Create Lesson Plan')}
              </Button>
            </div>

            {/* Content States */}
            {browseLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-border-ice p-6 flex flex-col gap-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-4/5" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-1/2 mt-auto" />
                  </div>
                ))}
              </div>
            ) : browseError ? (
              <ErrorState
                title="Could not load lesson plans"
                message={browseError}
                onRetry={fetchPlans}
              />
            ) : savedPlans.length === 0 ? (
              classFilter !== null ? (
                <EmptyState
                  icon={BookOpen}
                  title={t('emptyFilterTitle', 'No matching plans')}
                  description={t('emptyFilterDesc', 'Try selecting a different class filter or clear the filter.')}
                  actionLabel={t('allClasses', 'Show All Classes')}
                  onAction={() => setClassFilter(null)}
                />
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title={t('emptyBrowseTitle', 'No lesson plans yet')}
                  description={t('emptyBrowseDesc', 'Create your first curriculum-aligned lesson plan using authentic polar scientific data.')}
                  actionLabel={t('createButton', 'Create Lesson Plan')}
                  onAction={() => setActiveTab('create')}
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlans.map(draft => (
                  <LessonPlanCard
                    key={draft.id}
                    draft={draft}
                    onSelect={handleSelectSavedPlan}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
