import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';
import type { LessonPlanStructure, CurriculumConcept } from '../../types';
import { Button } from '../ui/Button';

interface LessonPlanPrintViewProps {
  plan: LessonPlanStructure;
  concept?: CurriculumConcept | null;
  targetClass: number;
  targetSubject: string;
  lang?: string;
  onClose: () => void;
  autoPrint?: boolean;
}

export function LessonPlanPrintView({
  plan,
  concept,
  targetClass,
  targetSubject,
  lang: _lang = 'en',
  onClose,
  autoPrint = false,
}: LessonPlanPrintViewProps) {
  const { t } = useTranslation('lesson-plans');
  const conceptTitle = concept?.concept || t('defaultConceptTitle', 'Polar Science Lesson Plan');

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-deep-ocean/50 backdrop-blur-sm p-4 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      {/* ─── PRINT-ONLY CSS ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #lesson-plan-print-root, #lesson-plan-print-root * {
            visibility: visible !important;
          }
          #lesson-plan-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}} />

      {/* Floating Toolbar (Hidden when printing) */}
      <div className="max-w-[850px] mx-auto mb-4 bg-white/95 backdrop-blur-md rounded-2xl border border-border-ice p-4 shadow-elevated flex items-center justify-between no-print animate-fade-down">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-accent" />
          <div>
            <h4 className="font-bold text-sm text-deep-ocean">
              {t('printView.heading', 'A4 Lesson Plan Print / PDF View')}
            </h4>
            <p className="text-xs text-muted">
              {t('printView.subheading', 'Use your browser dialog to print or save directly as PDF.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            {t('printView.printButton', 'Print / Save PDF')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close Print Preview"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ─── A4 DOCUMENT CANVAS ─── */}
      <div
        id="lesson-plan-print-root"
        className={`max-w-[850px] mx-auto bg-white border border-border-ice rounded-2xl p-8 sm:p-12 shadow-elevated print:border-none print:shadow-none print:p-0 font-sans`}
      >
        {/* Header Ribbon */}
        <header className="flex items-center justify-between border-b-2 border-cyan-accent pb-4 mb-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-deep-ocean">
              Ministry of Earth Sciences · NCPOR
            </span>
            <span className="text-[10px] text-muted font-medium">
              Government of India · Polar Science Knowledge Platform
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-black tracking-wider text-cyan-accent uppercase">
              POLARSETU CURRICULUM SERIES
            </span>
          </div>
        </header>

        {/* Title & Metadata */}
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-deep-ocean mb-3 leading-tight">
            {`${t('printView.planPrefix', 'Lesson Plan')}: ${conceptTitle}`}
          </h1>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-full bg-frost text-deep-ocean font-bold border border-border-ice">
              {`${t('printView.classPrefix', 'Class')} ${targetClass}`}
            </span>
            <span className="px-3 py-1 rounded-full bg-frost text-deep-ocean font-bold border border-border-ice">
              {targetSubject}
            </span>
            {concept?.nepTags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-ice-blue/60 text-deep-ocean font-semibold border border-border-ice text-[11px]"
              >
                NEP 2020: {tag}
              </span>
            ))}
            <span className="ml-auto text-[11px] text-muted flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              {t('printView.groundedBadge', 'Grounded in Indian Polar Expeditions')}
            </span>
          </div>
        </div>

        {/* ─── SECTION 1: TEACHER BRIEF ─── */}
        <section className="mb-6 p-5 rounded-xl border border-border-ice bg-[#F8FAFC] print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between border-b border-border-ice/80 pb-2 mb-3">
            <h2 className="font-display text-base font-bold text-deep-ocean flex items-center gap-2">
              1. {t('teacherBrief', 'Teacher Brief')}
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-ice-blue text-deep-ocean">
              {plan.teacher_brief.duration_minutes || 5} min
            </span>
          </div>
          <p className="text-sm leading-relaxed text-ink/90 whitespace-pre-line">
            {plan.teacher_brief.content}
          </p>

          {plan.teacher_brief.sources && plan.teacher_brief.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-ice/60">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                {t('sources', 'Sources & Evidence')}:
              </span>
              <ul className="text-xs text-glacial-blue space-y-0.5">
                {plan.teacher_brief.sources.map(s => (
                  <li key={s.id}>
                    • <span className="font-mono font-bold">[{s.id}]</span> {s.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ─── SECTION 2: DISCUSSION QUESTIONS ─── */}
        <section className="mb-6 p-5 rounded-xl border border-border-ice bg-[#F8FAFC] print:bg-white print:border-slate-300">
          <div className="border-b border-border-ice/80 pb-2 mb-4">
            <h2 className="font-display text-base font-bold text-deep-ocean">
              2. {t('discussionQuestions', 'Classroom Discussion Questions')}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {plan.discussion_questions.map((q, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <p className="text-sm font-bold text-deep-ocean">
                  Q{idx + 1}: {q.question}
                </p>
                <div className="pl-3 border-l-2 border-cyan-accent text-xs leading-relaxed text-ink/80">
                  <span className="font-bold text-deep-ocean/70 mr-1">A:</span>
                  {q.answer}
                </div>
                {q.sources && q.sources.length > 0 && (
                  <span className="text-[11px] text-muted italic pl-3">
                    {t('sourceCitation', 'Source')}: {q.sources.map(s => `[${s.id}] ${s.title}`).join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 3: HANDS-ON EXPERIMENT ─── */}
        <section className="mb-6 p-5 rounded-xl border border-border-ice bg-[#F8FAFC] print:bg-white print:border-slate-300">
          <div className="border-b border-border-ice/80 pb-2 mb-3">
            <h2 className="font-display text-base font-bold text-deep-ocean">
              3. {t('experiment', 'Hands-On Experiment')}: {plan.experiment.title}
            </h2>
          </div>

          {/* Materials */}
          <div className="mb-3">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('materials', 'Materials Required')}:
            </h3>
            <ul className="list-disc list-inside text-xs text-ink/90 space-y-1">
              {plan.experiment.materials.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="mb-3">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5">
              {t('steps', 'Step-by-step Procedure')}:
            </h3>
            <ol className="list-decimal list-inside text-xs text-ink/90 space-y-1.5">
              {plan.experiment.steps.map((st, idx) => (
                <li key={idx} className="leading-relaxed">{st}</li>
              ))}
            </ol>
          </div>

          {/* Connection */}
          <div className="pt-2 border-t border-border-ice/60">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
              {t('scientificConnection', 'Connection to Polar Research')}:
            </h3>
            <p className="text-xs text-ink/80 leading-relaxed">
              {plan.experiment.connection}
            </p>
          </div>

          {plan.experiment.sources && plan.experiment.sources.length > 0 && (
            <div className="mt-3 pt-2 text-[11px] text-glacial-blue">
              <span className="font-semibold">{t('sources', 'Sources')}:</span>{' '}
              {plan.experiment.sources.map(s => `[${s.id}] ${s.title}`).join(', ')}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="pt-4 border-t border-border-ice flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted gap-2">
          <span>
            National Centre for Polar and Ocean Research (NCPOR) · polarsetu.in
          </span>
          <span>
            Licensed under CC BY 4.0
          </span>
        </footer>
      </div>
    </div>
  );
}
