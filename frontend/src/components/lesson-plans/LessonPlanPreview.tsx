import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Download,
  Printer,
  Send,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  HelpCircle,
  FlaskConical,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import type {
  LessonPlanStructure,
  CurriculumConcept,
  ResourceStatus,
} from '../../types';
import { Button } from '../ui/Button';
import { SectionEditor } from './SectionEditor';
import { LessonPlanPrintView } from './LessonPlanPrintView';

interface LessonPlanPreviewProps {
  plan: LessonPlanStructure;
  concept?: CurriculumConcept | null;
  targetClass: number;
  targetSubject: string;
  lang?: string;
  citationValid?: boolean;
  warnings?: string[];
  status?: ResourceStatus;
  onUpdatePlan: (updatedPlan: LessonPlanStructure) => void;
  onSubmitForReview?: () => Promise<void>;
  isSubmitting?: boolean;
}

export function LessonPlanPreview({
  plan,
  concept,
  targetClass,
  targetSubject,
  lang = 'en',
  citationValid = true,
  warnings = [],
  status = 'DRAFT',
  onUpdatePlan,
  onSubmitForReview,
  isSubmitting = false,
}: LessonPlanPreviewProps) {
  const { t } = useTranslation('lesson-plans');
  const [activeEditingSection, setActiveEditingSection] = useState<
    'teacher_brief' | 'discussion_questions' | 'experiment' | null
  >(null);
  const [showPrintView, setShowPrintView] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(status === 'IN_REVIEW' || status === 'APPROVED');

  const conceptTitle = concept?.concept || t('defaultConceptTitle', 'Polar Science Lesson Plan');

  // Handle Download PDF
  const handleDownloadPDF = async () => {
    try {
      setIsDownloadingPdf(true);
      const { pdf } = await import('@react-pdf/renderer');
      const { LessonPlanPDFDoc } = await import('./LessonPlanPDF');

      const blob = await pdf(
        <LessonPlanPDFDoc
          plan={plan}
          concept={concept}
          targetClass={targetClass}
          targetSubject={targetSubject}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanName = (concept?.concept || 'lesson-plan')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      link.download = `aicygram-${cleanName}-class${targetClass}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate PDF via @react-pdf/renderer, falling back to print view', err);
      setShowPrintView(true);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyText = () => {
    const textLines = [
      `AICYGRAM LESSON PLAN: ${conceptTitle}`,
      `Class ${targetClass} · ${targetSubject}`,
      concept?.nepTags?.length ? `NEP 2020: ${concept.nepTags.join(', ')}` : '',
      '',
      `1. TEACHER BRIEF (${plan.teacher_brief.duration_minutes || 5} min)`,
      plan.teacher_brief.content,
      '',
      '2. DISCUSSION QUESTIONS',
      ...plan.discussion_questions.map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer}`),
      '',
      `3. HANDS-ON EXPERIMENT: ${plan.experiment.title}`,
      'Materials:',
      ...plan.experiment.materials.map(m => ` - ${m}`),
      'Steps:',
      ...plan.experiment.steps.map((s, i) => ` ${i + 1}. ${s}`),
      'Scientific Connection:',
      plan.experiment.connection,
    ].filter(Boolean);

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (onSubmitForReview) {
      await onSubmitForReview();
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ─── ACTION TOOLBAR ─── */}
      <div className="bg-white border border-border-ice rounded-2xl p-4 sm:p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Verification Status Badge */}
        <div className="flex items-center gap-3">
          {citationValid ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('groundedVerified', 'Grounded in Authenticated Research')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-bg text-amber-warn border border-[#F59E0B]/20 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('unverifiedCitations', 'Unverified Citations Detected')}</span>
            </div>
          )}

          {submitted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-accent/15 text-deep-ocean border border-cyan-accent/30">
              {t('statusPending', 'Awaiting Review')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyText}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-[#10B981]" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Text
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPrintView(true)}
            className="text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            {t('printView', 'Print / PDF View')}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadPDF}
            isLoading={isDownloadingPdf}
            className="text-xs bg-white text-deep-ocean hover:bg-frost"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-cyan-accent" />
            {t('downloadPDF', 'Download PDF')}
          </Button>

          {onSubmitForReview && !submitted && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="text-xs shadow-soft"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {t('submitForReview', 'Submit for Review')}
            </Button>
          )}
        </div>
      </div>

      {/* Warnings Banner if any */}
      {warnings && warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-bg border border-[#F59E0B]/30 flex items-start gap-3 text-xs text-amber-warn">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">Editorial Review Notice:</span>
            <ul className="list-disc list-inside">
              {warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ─── MAIN PREVIEW CONTAINER ─── */}
      <div className="bg-white border border-border-ice rounded-2xl p-6 sm:p-10 shadow-elevated flex flex-col gap-8">
        {/* Plan Header */}
        <div className="border-b border-border-ice pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-accent text-deep-ocean">
              Class {targetClass}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-frost text-deep-ocean border border-border-ice">
              {targetSubject}
            </span>
            {concept?.nepTags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-snow text-muted border border-border-ice"
              >
                NEP 2020: {tag}
              </span>
            ))}
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-deep-ocean">
            {conceptTitle}
          </h2>

          <p className="text-xs text-muted mt-2">
            {t('groundedNotice', 'Every concept and experiment is grounded in authenticated MoES/NCPOR expedition reports and datasets.')}
          </p>
        </div>

        {/* ─── SECTION 1: TEACHER BRIEF ─── */}
        <section className="bg-snow/60 border border-border-ice rounded-2xl p-6 relative group transition-all hover:border-cyan-accent/40">
          <div className="flex items-center justify-between mb-4 border-b border-border-ice/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-cyan-accent/15 text-deep-ocean flex items-center justify-center font-display font-bold text-sm">
                1
              </span>
              <div>
                <h3 className="font-display font-bold text-base text-deep-ocean flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-accent" />
                  {t('teacherBrief', 'Teacher Brief')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-ice-blue text-deep-ocean">
                <Clock className="w-3.5 h-3.5 text-cyan-accent" />
                {plan.teacher_brief.duration_minutes || 5} min
              </span>

              <button
                onClick={() => setActiveEditingSection('teacher_brief')}
                className="p-1.5 rounded-lg text-muted hover:text-deep-ocean hover:bg-white border border-transparent hover:border-border-ice transition-all cursor-pointer"
                title={t('editSection', 'Edit Section')}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-sm text-ink/90 leading-relaxed whitespace-pre-line">
            {plan.teacher_brief.content}
          </p>

          {plan.teacher_brief.sources && plan.teacher_brief.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border-ice/60 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('sources', 'Sources')}:
              </span>
              {plan.teacher_brief.sources.map(s => (
                <Link
                  key={s.id}
                  to={`/research/${s.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-glacial-blue hover:text-cyan-accent bg-white px-2.5 py-1 rounded-lg border border-border-ice transition-colors"
                >
                  <span className="font-mono text-[10px] opacity-70">[{s.id}]</span>
                  <span className="truncate max-w-[200px]">{s.title}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ─── SECTION 2: DISCUSSION QUESTIONS ─── */}
        <section className="bg-snow/60 border border-border-ice rounded-2xl p-6 relative group transition-all hover:border-cyan-accent/40">
          <div className="flex items-center justify-between mb-4 border-b border-border-ice/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-cyan-accent/15 text-deep-ocean flex items-center justify-center font-display font-bold text-sm">
                2
              </span>
              <h3 className="font-display font-bold text-base text-deep-ocean flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-accent" />
                {t('discussionQuestions', 'Classroom Discussion Questions')}
              </h3>
            </div>

            <button
              onClick={() => setActiveEditingSection('discussion_questions')}
              className="p-1.5 rounded-lg text-muted hover:text-deep-ocean hover:bg-white border border-transparent hover:border-border-ice transition-all cursor-pointer"
              title={t('editSection', 'Edit Section')}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {plan.discussion_questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-border-ice flex flex-col gap-2"
              >
                <span className="text-sm font-bold text-deep-ocean">
                  Q{idx + 1}: {q.question}
                </span>
                <p className="text-xs text-ink/80 leading-relaxed pl-3 border-l-2 border-cyan-accent">
                  {q.answer}
                </p>
                {q.sources && q.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 pt-2 border-t border-border-ice/40">
                    <span className="text-[10px] text-muted font-bold">Ref:</span>
                    {q.sources.map(s => (
                      <Link
                        key={s.id}
                        to={`/research/${s.id}`}
                        target="_blank"
                        className="text-[11px] text-glacial-blue hover:text-cyan-accent underline"
                      >
                        [{s.id}] {s.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 3: EXPERIMENT ─── */}
        <section className="bg-snow/60 border border-border-ice rounded-2xl p-6 relative group transition-all hover:border-cyan-accent/40">
          <div className="flex items-center justify-between mb-4 border-b border-border-ice/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-cyan-accent/15 text-deep-ocean flex items-center justify-center font-display font-bold text-sm">
                3
              </span>
              <div>
                <h3 className="font-display font-bold text-base text-deep-ocean flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-cyan-accent" />
                  {t('experiment', 'Hands-On Experiment')}: {plan.experiment.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setActiveEditingSection('experiment')}
              className="p-1.5 rounded-lg text-muted hover:text-deep-ocean hover:bg-white border border-transparent hover:border-border-ice transition-all cursor-pointer"
              title={t('editSection', 'Edit Section')}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Materials */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-deep-ocean uppercase tracking-wider mb-2">
              {t('materials', 'Materials Required')}:
            </h4>
            <div className="flex flex-wrap gap-2">
              {plan.experiment.materials.map((m, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-white border border-border-ice text-xs text-ink/90 font-medium"
                >
                  • {m}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="mb-4">
            <h4 className="text-xs font-bold text-deep-ocean uppercase tracking-wider mb-2">
              {t('steps', 'Step-by-step Procedure')}:
            </h4>
            <ol className="flex flex-col gap-2">
              {plan.experiment.steps.map((st, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-border-ice text-xs text-ink/90 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-frost text-deep-ocean font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{st}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Connection */}
          <div className="p-4 rounded-xl bg-white border border-border-ice">
            <h4 className="text-xs font-bold text-cyan-accent uppercase tracking-wider mb-1.5">
              {t('scientificConnection', 'Connection to Polar Research')}:
            </h4>
            <p className="text-xs text-ink/80 leading-relaxed">
              {plan.experiment.connection}
            </p>
          </div>

          {plan.experiment.sources && plan.experiment.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border-ice/60 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('sources', 'Sources')}:
              </span>
              {plan.experiment.sources.map(s => (
                <Link
                  key={s.id}
                  to={`/research/${s.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-glacial-blue hover:text-cyan-accent bg-white px-2.5 py-1 rounded-lg border border-border-ice transition-colors"
                >
                  <span className="font-mono text-[10px] opacity-70">[{s.id}]</span>
                  <span className="truncate max-w-[200px]">{s.title}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ─── SECTION EDITOR MODAL ─── */}
      {activeEditingSection && (
        <SectionEditor
          section={activeEditingSection}
          data={plan}
          onSave={updated => {
            onUpdatePlan(updated);
            setActiveEditingSection(null);
          }}
          onClose={() => setActiveEditingSection(null)}
        />
      )}

      {/* ─── PRINT / PDF VIEW MODAL ─── */}
      {showPrintView && (
        <LessonPlanPrintView
          plan={plan}
          concept={concept}
          targetClass={targetClass}
          targetSubject={targetSubject}
          lang={lang}
          onClose={() => setShowPrintView(false)}
        />
      )}
    </div>
  );
}
