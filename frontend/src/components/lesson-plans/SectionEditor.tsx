import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, Clock, HelpCircle, FlaskConical, BookOpen } from 'lucide-react';
import type { LessonPlanStructure, DiscussionQuestion } from '../../types';
import { Button } from '../ui/Button';

interface SectionEditorProps {
  section: 'teacher_brief' | 'discussion_questions' | 'experiment' | null;
  data: LessonPlanStructure;
  onSave: (updatedData: LessonPlanStructure) => void;
  onClose: () => void;
}

export function SectionEditor({ section, data, onSave, onClose }: SectionEditorProps) {
  const { t } = useTranslation('lesson-plans');

  // Local editable states based on section
  const [briefContent, setBriefContent] = useState(data.teacher_brief.content);
  const [briefDuration, setBriefDuration] = useState(data.teacher_brief.duration_minutes);

  const [questions, setQuestions] = useState<DiscussionQuestion[]>(
    data.discussion_questions.map(q => ({ ...q }))
  );

  const [expTitle, setExpTitle] = useState(data.experiment.title);
  const [expMaterials, setExpMaterials] = useState(data.experiment.materials.join('\n'));
  const [expSteps, setExpSteps] = useState(data.experiment.steps.join('\n'));
  const [expConnection, setExpConnection] = useState(data.experiment.connection);

  if (!section) return null;

  const handleSave = () => {
    const updated: LessonPlanStructure = {
      ...data,
      teacher_brief:
        section === 'teacher_brief'
          ? {
              ...data.teacher_brief,
              content: briefContent,
              duration_minutes: Number(briefDuration) || 5,
            }
          : data.teacher_brief,
      discussion_questions:
        section === 'discussion_questions'
          ? questions
          : data.discussion_questions,
      experiment:
        section === 'experiment'
          ? {
              ...data.experiment,
              title: expTitle,
              materials: expMaterials.split('\n').map(s => s.trim()).filter(Boolean),
              steps: expSteps.split('\n').map(s => s.trim()).filter(Boolean),
              connection: expConnection,
            }
          : data.experiment,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-ocean/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-border-ice shadow-elevated w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-ice flex items-center justify-between bg-snow/80">
          <div className="flex items-center gap-2.5">
            {section === 'teacher_brief' && <BookOpen className="w-5 h-5 text-cyan-accent" />}
            {section === 'discussion_questions' && <HelpCircle className="w-5 h-5 text-cyan-accent" />}
            {section === 'experiment' && <FlaskConical className="w-5 h-5 text-cyan-accent" />}
            <h3 className="font-display font-bold text-lg text-deep-ocean">
              {section === 'teacher_brief' && t('teacherBrief', 'Edit Teacher Brief')}
              {section === 'discussion_questions' && t('discussionQuestions', 'Edit Discussion Questions')}
              {section === 'experiment' && t('experiment', 'Edit Hands-On Experiment')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-frost transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5 custom-scrollbar">
          {section === 'teacher_brief' && (
            <>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-deep-ocean uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted" /> Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={briefDuration}
                  onChange={e => setBriefDuration(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-1.5 border border-border-ice rounded-lg text-sm font-semibold text-deep-ocean"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-deep-ocean uppercase tracking-wider">
                  Teacher Brief Content
                </label>
                <textarea
                  rows={8}
                  value={briefContent}
                  onChange={e => setBriefContent(e.target.value)}
                  className="w-full p-3.5 border border-border-ice rounded-xl text-sm leading-relaxed text-ink focus:outline-none focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent"
                />
              </div>
            </>
          )}

          {section === 'discussion_questions' && (
            <div className="flex flex-col gap-6">
              {questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border-ice bg-snow/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-accent uppercase tracking-wider">
                      Question {idx + 1}
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Question Prompt
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={e => {
                        const next = [...questions];
                        next[idx].question = e.target.value;
                        setQuestions(next);
                      }}
                      className="w-full px-3 py-2 border border-border-ice rounded-lg text-sm text-deep-ocean font-medium focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Target Answer / Scientific Rationale
                    </label>
                    <textarea
                      rows={3}
                      value={q.answer}
                      onChange={e => {
                        const next = [...questions];
                        next[idx].answer = e.target.value;
                        setQuestions(next);
                      }}
                      className="w-full p-3 border border-border-ice rounded-lg text-xs leading-relaxed text-ink focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === 'experiment' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-deep-ocean uppercase tracking-wider block mb-1.5">
                  Experiment Title
                </label>
                <input
                  type="text"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border-ice rounded-xl text-sm font-bold text-deep-ocean focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-deep-ocean uppercase tracking-wider block mb-1">
                  {t('materials', 'Materials Required')} <span className="text-muted font-normal">(one item per line)</span>
                </label>
                <textarea
                  rows={4}
                  value={expMaterials}
                  onChange={e => setExpMaterials(e.target.value)}
                  className="w-full p-3 border border-border-ice rounded-xl text-xs leading-relaxed text-ink focus:outline-none focus:border-cyan-accent"
                  placeholder="Ice cubes&#10;Water container&#10;Food colouring"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-deep-ocean uppercase tracking-wider block mb-1">
                  {t('steps', 'Step-by-step Procedure')} <span className="text-muted font-normal">(one step per line)</span>
                </label>
                <textarea
                  rows={5}
                  value={expSteps}
                  onChange={e => setExpSteps(e.target.value)}
                  className="w-full p-3 border border-border-ice rounded-xl text-xs leading-relaxed text-ink focus:outline-none focus:border-cyan-accent"
                  placeholder="1. Fill the container with cold water...&#10;2. Add the ice block..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-deep-ocean uppercase tracking-wider block mb-1">
                  {t('scientificConnection', 'Connection to Polar Research')}
                </label>
                <textarea
                  rows={3}
                  value={expConnection}
                  onChange={e => setExpConnection(e.target.value)}
                  className="w-full p-3 border border-border-ice rounded-xl text-xs leading-relaxed text-ink focus:outline-none focus:border-cyan-accent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border-ice bg-snow/50 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {t('saveChanges', 'Save Changes')}
          </Button>
        </div>
      </div>
    </div>
  );
}
