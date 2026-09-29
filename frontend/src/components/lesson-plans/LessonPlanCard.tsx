import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import type { OutreachDraft, LessonPlanStructure } from '../../types';

interface LessonPlanCardProps {
  draft: OutreachDraft;
  onSelect: (draft: OutreachDraft) => void;
}

export function LessonPlanCard({ draft, onSelect }: LessonPlanCardProps) {
  const { t } = useTranslation('lesson-plans');

  // Parse plan content if stored as JSON string
  let parsedPlan: LessonPlanStructure | null = null;
  try {
    if (typeof draft.content === 'string' && draft.content.startsWith('{')) {
      parsedPlan = JSON.parse(draft.content);
    }
  } catch {
    parsedPlan = null;
  }

  const meta = draft.metadata || {};
  const cls = meta.class || 10;
  const subject = meta.subject || draft.audience || 'Science';
  const concept = meta.concept || (parsedPlan?.experiment?.title ? parsedPlan.experiment.title : 'Curriculum Lesson Plan');
  const isApproved = draft.status === 'APPROVED' || draft.status === 'PUBLISHED';

  const dateStr = draft.createdAt
    ? new Date(draft.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article
      onClick={() => onSelect(draft)}
      className="bg-white rounded-2xl border border-border-ice p-6 shadow-soft hover:shadow-elevated hover:border-cyan-accent/60 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isApproved ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />

      <div className="flex flex-col gap-3.5">
        {/* Meta Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-accent/15 text-deep-ocean border border-cyan-accent/30">
              Class {cls}
            </span>
            <span className="text-xs font-medium text-muted">
              {subject}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isApproved
                ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                : 'bg-amber-bg text-amber-warn border border-[#F59E0B]/20'
            }`}
          >
            {isApproved ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> {t('statusApproved', 'Approved')}
              </>
            ) : (
              <>
                <Clock className="w-3 h-3" /> {t('statusPending', 'Awaiting Review')}
              </>
            )}
          </span>
        </div>

        {/* Concept Title */}
        <h3 className="font-display text-lg font-bold text-deep-ocean group-hover:text-cyan-accent transition-colors line-clamp-2">
          {concept}
        </h3>

        {/* Brief Excerpt */}
        {parsedPlan?.teacher_brief?.content && (
          <p className="text-xs text-muted leading-relaxed line-clamp-3">
            {parsedPlan.teacher_brief.content}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-4 border-t border-border-ice flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          {dateStr && (
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Calendar className="w-3 h-3 text-muted/70" /> {dateStr}
            </span>
          )}

        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-deep-ocean group-hover:text-cyan-accent group-hover:translate-x-1 transition-all">
          View Plan <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
}
